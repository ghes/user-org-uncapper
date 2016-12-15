/* global GM_setValue GM_getValue */

// ==UserScript==
// @name         GitHub User Organization List Uncapper
// @namespace    https://github.com/ghes
// @version      0.1.0
// @description  Display a user's public organizations beyond the 25 GitHub now limits a user page to
// @author       Stuart P. Bentley (@stuartpb)
// @match        https://github.com/*
// @connect      api.github.com
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
  "use strict";
  var userOrgCap = 25;
  function addNewOrgs(orgList, orgNodes) {
    var i;
    var orgSkipList = [];
    // we clone the last org and not the first one
    // because we gank its preceding whitespace text node
    var templateOrg = orgNodes[orgNodes.length - 1];
    var orgContainer = templateOrg.parentNode;
    for (i = 0; i < orgNodes.length; i++) {
      var orgname = orgNodes[i].href.slice(
        orgNodes[i].href.lastIndexOf('/')+1);
      var orgIndex = orgList.findIndex(function(orgData) {
        return orgData.login == orgname;
      });
      if (orgIndex > -1) {
        orgSkipList[orgIndex] = true;
      }
    }
    for (i = 0; i < orgList.length; i++) {
      if (!orgSkipList[i]) {
        var newOrgData = orgList[i];
        var newOrgItem = templateOrg.cloneNode(true);
        newOrgItem.href = '/' + newOrgData.login;
        newOrgItem.setAttribute('aria-label', newOrgData.login);
        var newOrgAvatar = newOrgItem.children[0];
        newOrgAvatar.alt = '@' + newOrgData.login;
        newOrgAvatar.src = newOrgData.avatar_url + '&s=70';
        // clone the whitespace preceding our template
        orgContainer.appendChild(templateOrg.previousSibling.cloneNode(false));
        orgContainer.appendChild(newOrgItem);
      }
    }
  }
  if (location.pathname.indexOf('/',1) == -1) {
    var username = location.pathname.slice(1);
    var userSidebar = document.querySelector('[itemtype="http://schema.org/Person"]');
    if (userSidebar) {
      var userOrgAvatars = userSidebar.getElementsByClassName('avatar-group-item');

      // if this appears to be a user with the maximum number of organizations
      if (userOrgAvatars.length == userOrgCap) {
        var apiPath = 'users/' + username + '/orgs';
        var cachedUserOrgsJson = GM_getValue(apiPath);
        if (cachedUserOrgsJson) {
          var cachedUserOrgsArray = JSON.parse(cachedUserOrgsJson);
          addNewOrgs(cachedUserOrgsArray, userOrgAvatars);
        }
        fetch('https://api.github.com/' + apiPath).then(function (res) {
          return res.text();
        }).then(function (jsonStr) {
          // TODO: remove any organizations we erroneously added from cache
          GM_setValue(apiPath, jsonStr);
          addNewOrgs(JSON.parse(jsonStr), userOrgAvatars);
        });
      }
    }
  }
})();
