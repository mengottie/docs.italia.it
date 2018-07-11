require=function(){function e(r,t,n){function a(s,i){if(!t[s]){if(!r[s]){var u="function"==typeof require&&require;if(!i&&u)return u(s,!0);if(o)return o(s,!0);var c=new Error("Cannot find module '"+s+"'");throw c.code="MODULE_NOT_FOUND",c}var l=t[s]={exports:{}};r[s][0].call(l.exports,function(e){var t=r[s][1][e];return a(t||e)},l,l.exports,e,r,t,n)}return t[s].exports}for(var o="function"==typeof require&&require,s=0;s<n.length;s++)a(n[s]);return a}return e}()({1:[function(e,r,t){function n(e){function r(){$.ajax(e.url,{dataType:"json",success:function(e){e.finished?e.success?t.resolve():t.reject({message:e.error}):setTimeout(r,2e3)},error:function(e){if(console.error("Error polling task:",e),n-=1,n>0)setTimeout(r,2e3);else{var a=e.responseJSON.detail||e.statusText;t.reject({message:a})}}})}var t=$.Deferred(),n=5;return setTimeout(r,2e3),t}function a(e){var r=$.Deferred(),t=e.url,a=e.token,o={csrfmiddlewaretoken:a};return $.ajax({method:"POST",url:t,data:o,success:function(e){n(e).then(function(){r.resolve()}).fail(function(e){r.reject(e)})},error:function(e){var t=e.responseJSON.detail||e.statusText;r.reject({message:t})}}),r}r.exports={poll_task:n,trigger_task:a}},{}],"projects/import":[function(e,r,t){function n(e,r){var t=$("<a>").attr("href",e).get(0);return Object.keys(r).map(function(e){t.search&&(t.search+="&"),t.search+=e+"="+r[e]}),t.href}function a(e,r){var t=this;t.id=u.observable(e.id),t.name=u.observable(e.name),t.slug=u.observable(e.slug),t.active=u.observable(e.active),t.avatar_url=u.observable(n(e.avatar_url,{size:32})),t.display_name=u.computed(function(){return t.name()||t.slug()}),t.filter_id=u.computed(function(){return t.id()}),t.filter_type="org",t.filtered=u.computed(function(){var e=r.filter_by();return e.id&&e.id!==t.filter_id()||e.type&&e.type!==t.filter_type})}function o(e,r){var t=this;t.id=u.observable(e.id),t.username=u.observable(e.username),t.active=u.observable(e.active),t.avatar_url=u.observable(n(e.avatar_url,{size:32})),t.provider=u.observable(e.provider),t.display_name=u.computed(function(){return t.username()}),t.filter_id=u.computed(function(){return t.provider().id}),t.filter_type="own",t.filtered=u.computed(function(){var e=r.filter_by();return e.id&&e.id!==t.filter_id()||e.type&&e.type!==t.filter_type})}function s(e,r){var t=this;t.id=u.observable(e.id),t.name=u.observable(e.name),t.full_name=u.observable(e.full_name),t.description=u.observable(e.description),t.vcs=u.observable(e.vcs),t.organization=u.observable(e.organization),t.html_url=u.observable(e.html_url),t.clone_url=u.observable(e.clone_url),t.ssh_url=u.observable(e.ssh_url),t.matches=u.observable(e.matches),t.match=u.computed(function(){var e=t.matches();if(e&&e.length>0)return e[0]}),t["private"]=u.observable(e["private"]),t.active=u.observable(e.active),t.admin=u.observable(e.admin),t.is_locked=u.computed(function(){return t["private"]()&&!t.admin()}),t.avatar_url=u.observable(n(e.avatar_url,{size:32})),t.import_repo=function(){var e={name:t.name(),repo:t.clone_url(),repo_type:t.vcs(),description:t.description(),project_url:t.html_url(),remote_repository:t.id()},n=$("<form />");n.attr("action",r.urls.projects_import).attr("method","POST").hide(),Object.keys(e).map(function(r){var t=$("<input>").attr("type","hidden").attr("name",r).attr("value",e[r]);n.append(t)});var a=$("<input>").attr("type","hidden").attr("name","csrfmiddlewaretoken").attr("value",r.csrf_token);n.append(a);var o=$("<input>").attr("type","submit");n.append(o),$("body").append(n),n.submit()}}function i(e,r){var t=this;t.config=r||{},t.urls=r.urls||{},t.csrf_token=r.csrf_token||"",t.error=u.observable(null),t.is_syncing=u.observable(!1),t.is_ready=u.observable(!1),t.page_current=u.observable(null),t.page_next=u.observable(null),t.page_previous=u.observable(null),t.filter_by=u.observable({id:null,type:null}),t.accounts_raw=u.observableArray(),t.organizations_raw=u.observableArray(),t.filters=u.computed(function(){var e,r=[],n=t.accounts_raw(),s=t.organizations_raw();for(e in n){var i=new o(n[e],t);r.push(i)}for(e in s){var u=new a(s[e],t);r.push(u)}return r}),t.projects=u.observableArray(),u.computed(function(){var e=t.filter_by(),r=t.page_current()||t.urls["remoterepository-list"];t.page_current()||("org"===e.type&&(r=n(t.urls["remoterepository-list"],{org:e.id})),"own"===e.type&&(r=n(t.urls["remoterepository-list"],{own:e.id}))),t.error(null),$.getJSON(r).done(function(e){var r=[];t.page_next(e.next),t.page_previous(e.previous);var n;for(n in e.results){var a=new s(e.results[n],t);r.push(a)}t.projects(r)}).fail(function(e){var r=e.responseJSON.detail||e.statusText;t.error({message:r})}).always(function(){t.is_ready(!0)})}).extend({deferred:!0}),t.get_organizations=function(){$.getJSON(t.urls["remoteorganization-list"]).done(function(e){t.organizations_raw(e.results)}).fail(function(e){var r=e.responseJSON.detail||e.statusText;t.error({message:r})})},t.get_accounts=function(){$.getJSON(t.urls["remoteaccount-list"]).done(function(e){t.accounts_raw(e.results)}).fail(function(e){var r=e.responseJSON.detail||e.statusText;t.error({message:r})})},t.sync_projects=function(){var e=t.urls.api_sync_remote_repositories;t.error(null),t.is_syncing(!0),c.trigger_task({url:e,token:t.csrf_token}).then(function(e){t.get_organizations(),t.get_accounts()}).fail(function(e){t.error(e)}).always(function(){t.is_syncing(!1)})},t.has_projects=u.computed(function(){return t.projects().length>0}),t.next_page=function(){t.page_current(t.page_next())},t.previous_page=function(){t.page_current(t.page_previous())},t.set_filter_by=function(e,r){var n=t.filter_by();n.id===e?(n.id=null,n.type=null):(n.id=e,n.type=r),t.filter_by(n),n.id&&t.page_current(null)}}var u=e("knockout"),c=e("readthedocs/core/static-src/core/js/tasks");$(function(){var e=$("#id_repo"),r=$("#id_repo_type");e.blur(function(){var t,n=e.val();switch(!0){case/^hg/.test(n):t="hg";break;case/^bzr/.test(n):case/launchpad/.test(n):t="bzr";break;case/trunk/.test(n):case/^svn/.test(n):t="svn";break;default:case/github/.test(n):case/(^git|\.git$)/.test(n):t="git"}r.val(t)})}),i.init=function(e,r,t){var n=new i(r,t);return n.get_accounts(),n.get_organizations(),u.applyBindings(n,e),n},r.exports.ProjectImportView=i},{knockout:"knockout","readthedocs/core/static-src/core/js/tasks":1}]},{},[]);