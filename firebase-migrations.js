// These code snipets have been used to migrate firebase data


// populate code-meta-data from the code database
var objectOfObjectsToArray = function(obj, keyName = "key"){
  return Object.keys(obj).map(function(key) {
    var child = obj[key]
    child[keyName] = key
    return child;
  })
}

require('lodash')
var _
setTimeout(() => _ = lodash, 500)
var updates = {}
firebase.database().ref('/code/').on('value', function(snapshot) {
  const projectsArray = objectOfObjectsToArray(snapshot.val())
  
  // nesting revisions under projects
  const projectsArrayWithRevisionsArray = _.map(projectsArray, function(project){
    const keys = Object.keys(project)
    const revisionKeys = keys.filter(key => key != '--uid' && key != 'key')
    return {
      name: project.key,
      uid: project["--uid"],
      revisions: _.map(revisionKeys, key => {
        const revision = project[key]
        revision.id = key
        revision.project = project
        return revision
      })
    }
  })
    

  _.map(projectsArrayWithRevisionsArray, project => {
    const firstRevision = project.revisions[0]
    const lastRevision = project.revisions[project.revisions.length - 1]
    if (project.name && !project.name.startsWith('-K')) {
      if (firstRevision.time) {
        updates["/code-meta-data/"+ project.name + "/projectCreatedTime"] = firstRevision.time
      }
      if (lastRevision.code) {
        updates["/code-meta-data/"+ project.name + "/currentVersionText"] = lastRevision.code
      }
      if (lastRevision.time) {
        updates["/code-meta-data/"+ project.name + "/currentVersionTime"] = lastRevision.time
      }
      if (lastRevision.uid) {
        updates["/code-meta-data/"+ project.name + "/uid"] = lastRevision.uid
      } 
      _.map(project.revisions, revision => {
        if (revision.time) {
          updates["/code-meta-data/"+ project.name + "/version/" + revision.id] = revision.time
        }
      })
    }
  })
  
  firebase.database().ref().update(updates)
})



// fix the code-meta-data cache by updating projectCreatedTime to the first revision's time
var objectOfObjectsToArray = function(obj, keyName = "key"){
  return Object.keys(obj).map(function(key) {
    var child = obj[key]
    child[keyName] = key
    return child;
  })
}

require('lodash')
var _
setTimeout(() => _ = lodash, 500)
var updates = {}
firebase.database().ref('/code-meta-data').on('value', function(snapshot) {
  const projectsArray = objectOfObjectsToArray(snapshot.val())
  _.map(projectsArray, project => {
    if (project.version) {
      const firstRevisionKey = Object.keys(project.version)[0]
      const firstRevisionTime = project.version[firstRevisionKey]
      if (firstRevisionTime) {
        updates["/code-meta-data/"+ project.key + "/projectCreatedTime"] = firstRevisionTime
      }
    }
  })
    
  firebase.database().ref().update(updates)
})