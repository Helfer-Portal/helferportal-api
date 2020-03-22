const SailsEmber = require('sails-ember-rest');

const { camelCase, reduce, uniq } = _;
const pluralize = require('pluralize');

/**
 * VOLL: Overwrite function because self associated relations should not be interpreted.
 * Why? Let's assume we have 3 users matching name "voll". They have relations to 2 other users. A request to /users?filter[where][name][contains]=voll would give us a meta.total=3 but we would get have 5 users, because the related users would also be included in the response object.
 * As long as we don't use JSON API we will get that issue.
 *
 * Prepare records and populated associations to be consumed by Ember's DS.RESTAdapter
 *
 * @param model Waterline collection object (returned from parseModel)
 * @param {Array|Object} records A record or an array of records returned from a Waterline query
 * @param associations Definition of the associations, from `req.option.associations`
 * @param associatedRecords Associated records
 * @return {Object} The returned structure can be consumed by DS.RESTAdapter when passed to res.json()
 */
SailsEmber.service.buildResponse = function(
  model,
  records,
  associations,
  associatedRecords
) {
  // console.log('MY buildResponse', model.globalId);
  let primaryKey = model.primaryKey;
  let emberModelIdentity = model.globalId;
  let modelPlural = pluralize(emberModelIdentity);
  let linkPrefix = sails.config.blueprints.linkPrefix
    ? sails.config.blueprints.linkPrefix
    : '';
  let documentIdentifier = camelCase(modelPlural);
  const toJSON = model.customToJSON
    ? model.customToJSON
    : function() {
        return this;
      };
  let json = {};

  json[documentIdentifier] = [];
  records = Array.isArray(records) ? records : [records];

  // console.log('model', model);
  // console.log('records', records[0].users[0]);

  // prepare for sideloading
  associations.forEach(assoc => {
    // only sideload, when the full records are to be included, more info on setup here https://github.com/Incom/incom-api/wiki/Models:-Defining-associations
    if (assoc.include === 'record') {
      let assocModelIdentifier = pluralize(
        camelCase(sails.models[assoc.collection || assoc.model].globalId)
      );

      // Todo: VOLL - Wenn es eine Self-relation ist, also ein User hat User als abhängigkeit, dann mit _users übergeben
      // if (assocModelIdentifier === documentIdentifier) {
      //   assocModelIdentifier = `_${assocModelIdentifier}`;
      // }

      // initialize jsoning object
      if (!json.hasOwnProperty(assoc.alias)) {
        json[assocModelIdentifier] = [];
      }
    }
  });

  // console.log('matchingRecord', records);

  // console.log('associations', associations);
  // ->
  // assoc = {
  //   alias: 'parent',
  //   type: 'model',
  //   model: 'user',
  //   include: 'record'
  // }
  // assoc {
  //   alias: 'children',
  //   type: 'collection',
  //   collection: 'user',
  //   via: 'parent',
  //   include: 'record'
  // }
  // assoc {
  //   alias: 'markets',
  //   type: 'collection',
  //   collection: 'market',
  //   via: 'users',
  //   include: 'record'
  // }

  // console.log('JSON', json);
  // console.log('records', records);
  // -> { users: [], markets: [] }

  records.forEach(record => {
    // get rid of the record's prototype ( otherwise the .toJSON called in res.send would re-insert embedded records)
    let links = {};
    record = Object.assign({}, toJSON.call(record));
    associations.forEach(assoc => {
      let assocModelIdentifier = pluralize(
        camelCase(sails.models[assoc.collection || assoc.model].globalId)
      );
      let assocModel;
      let assocPK;
      // console.log('assoc',assoc);
      // console.log('---------', assoc.alias, '------------------------------------------------------------');
      // console.log('JSON before collection', json);
      if (assoc.type === 'collection') {
        // console.log('COLLECTION');
        assocModel = sails.models[assoc.collection];
        assocPK = assocModel.primaryKey;
        let via = assoc.via;

        // console.log('assoc.collection',assoc.collection);
        // console.log('model.globalId',model.globalId);
        // console.log('modelPlural',modelPlural);
        // console.log('assocModelIdentifier',assocModelIdentifier);
        if (
          (assoc.include === 'index' || assoc.include === 'record') &&
          record[assoc.alias] &&
          record[assoc.alias].length > 0
        ) {
          // console.log('COLLECTION 1');

          // Todo: VOLL - self-referencing with underscore _users instead of users
          // if (assocModelIdentifier === documentIdentifier) {
          //   assocModelIdentifier = `_${assocModelIdentifier}`;
          // }

          if (assocModelIdentifier !== documentIdentifier) {
            // Todo: VOLL - Associations dürfen keine Links zu Relations erhalten, sonst haut EmberData die raus
            // sideload association records with links for 3rd level associations
            json[assocModelIdentifier] = uniq(
              json[assocModelIdentifier].concat(record[assoc.alias]),
              // json[assocModelIdentifier].concat(Ember.linkAssociations(assocModel, record[assoc.alias])),
              assocPK
            );
          }

          // console.log('json[assocModelIdentifier]', json[assocModelIdentifier]);
          // reduce association on primary record to an array of IDs
          record[assoc.alias] = reduce(
            record[assoc.alias],
            (filtered, rec) => {
              filtered.push(rec[assocPK]);
              return filtered;
            },
            []
          );
        }

        //through relations not in link mode are now covered by populate instead of index associations,
        //so they are processed in the if statement above ^
        if (
          !assoc.through &&
          assoc.include === 'index' &&
          associatedRecords[assoc.alias]
        ) {
          // console.log('COLLECTION 2');
          record[assoc.alias] = reduce(
            associatedRecords[assoc.alias],
            (filtered, rec) => {
              if (rec[via] === record[primaryKey]) {
                filtered.push(rec[assocPK]);
              }
              return filtered;
            },
            []
          );
        }

        //@todo if assoc.include startsWith index: ... fill contents from selected column of join table
        if (assoc.include === 'link') {
          // console.log('COLLECTION 3');
          links[assoc.alias] =
            linkPrefix +
            '/' +
            modelPlural.toLowerCase() +
            '/' +
            record[model.primaryKey] +
            '/' +
            assoc.alias; //"/" + sails.config.blueprints.prefix
          delete record[assoc.alias];
        }
        //record[assoc.alias] = map(record[assoc.alias], 'id');
      }

      // console.log('JSON before record', json);
      if (
        assoc.include === 'record' &&
        assoc.type === 'model' &&
        record[assoc.alias]
      ) {
        // console.log('RECORD');
        assocModel = sails.models[assoc.model];
        assocPK = assocModel.primaryKey;
        // let linkedRecords = Ember.linkAssociations(assocModel, record[assoc.alias]);
        let linkedRecords = [record[assoc.alias]];

        // Todo: VOLL - self-referencing with underscore _users instead of users
        // if (assocModelIdentifier === documentIdentifier) {
        //   assocModelIdentifier = `_${assocModelIdentifier}`;
        // }

        if (assocModelIdentifier !== documentIdentifier) {
          json[assocModelIdentifier] = uniq(
            json[assocModelIdentifier].concat(record[assoc.alias]),
            assocPK
          );
        }

        record[assoc.alias] = linkedRecords[0][assocPK]; // reduce embedded record to id
        /*
        // while it's possible, we should not really do this, it is more efficient to return a single model in a 1 to 1 relationship
        if (assoc.include === "link")
        {
            links[ assoc.alias ] = sails.config.blueprints.prefix + "/" + modelPlural.toLowerCase() + "/" + record.id + "/" + assoc.alias;
            delete record[ assoc.alias ];
        }
        */
      }
      // console.log('JSON after record', json);
    });
    if (Object.keys(links).length > 0) {
      record.links = links;
    }
    json[documentIdentifier].push(record);
    // json[emberModelIdentity.toLowerCase()] = record;
    // console.log('JSON', json);
  });
  // console.log('JSON', json);
  json = Ember.finalizeSideloads(json, documentIdentifier);

  return json;
};

/**
 * Prepare sideloaded records for final return to Ember's DS.RESTAdapter
 *
 * @param {Object} json A sideloaded record hash
 * @param {String} documentIdentifier A string that identifies the primary object queried by the user
 * @return {Object} The returned structure can be consumed by DS.RESTAdapter when passed to res.json()
 */
SailsEmber.service.finalizeSideloads = function(json, documentIdentifier) {
  // filter duplicates in sideloaded records
  Object.keys(json).forEach(key => {
    let array = json[key];
    if (key === documentIdentifier) {
      return;
    }
    if (array.length === 0) {
      delete json[key];
      // return;
    }

    // Todo: VOLL - Associations dürfen keine Links zu Relations erhalten, sonst haut EmberData die raus
    // let model = sails.models[pluralize(camelCase(key).toLowerCase(), 1)];
    // Ember.linkAssociations(model, array);
  });

  return json;
};

module.exports = SailsEmber.service;
