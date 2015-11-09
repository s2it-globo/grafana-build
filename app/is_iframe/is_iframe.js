"use strict";
var intervalReload;
function hideTopBar(){
  if($('.ng-scope[src=topNavPartial]').length > 0)
    $('.ng-scope[src=topNavPartial]').attr('style','display: none !important');
}
function hideSideMenu(){
  if($('aside.sidemenu-wrapper').length > 0)
    $('aside.sidemenu-wrapper').attr('style','display: none !important');
}
function mainViewPaddingAdjust(){
  if($('div.main-view').length > 0)
    $('div.main-view').attr('style',"padding-left: 0px !important");
}
function hideToggleMenu(){
  if($('.dropdown-toggle').length > 0)
    $('.dropdown-toggle').attr('style','display: none !important');
}
function hidePanels(obj){
  var hash = window.location.hash.replace('#', '');
  if(hash.indexOf('is_iframe') >= 0){
    switch(obj){
      case 'top-nav':
        hideTopBar();
        break;
      case 'side-menu':
        hideSideMenu();
        break;
      case 'dashboard':
        hideToggleMenu();
        mainViewPaddingAdjust();
        break;
    }
  }
  triggerInterval();
}
function triggerInterval(){
  var hash = window.location.hash.replace('#', '');
  if(hash.indexOf('reload') >= 0){
    var time = hash.split('-')
    clearInterval(intervalReload);
    intervalReload = setInterval(function() {
      console.log('dei reload');
      $('.grafana-menu-refresh a').click();
    }, time[2]);
  }
}