<?php

  //
  // Variables
  // --------------------------------------------------
  $gaid = 'UA-XXXXX-X';
  // $env = 'development';

  $fbogm = new stdClass;
  $fbogm->img = 'TODO';

  $preRootJS = '/public/js';
  $preRootCss =  '/public/css';
  $preRootImg =  '/public/img';
  $preRootVideo =  '/public/video';

  $assets_css = $preRootCss.'/styles.css';
  $assets_js = $preRootJS.'/main.bundle.js';
  $WP_ENV = '';

  //
  // Ambiente
  // --------------------------------------------------
  // $WP_ENV = $env;

  // if (!$WP_ENV) {
  //   $WP_ENV = 'production';
  // }

  // if ( $_SERVER["SERVER_ADDR"] == '127.0.0.1' || $_SERVER["SERVER_ADDR"] == '::1') {
  //   $WP_ENV = 'development';
  // } else {
  //   $WP_ENV = 'production';
  // }

    $WP_ENV = 'development';

  /**
  * Development o Production files
  **/
  if ($WP_ENV === 'production') {
    $preRootJS = '/public-build/js';
    $preRootCss =  '/public-build/css';
    $preRootImg =  '/public-build/img';
    $preRootVideo =  '/public-build/video';

    $assets_css = $preRootCss.'/styles.min.css';
    $assets_js = $preRootJS.'/main.bundle.min.js';
  }

  /**
  * GLOBALS
  **/
 $GLOBALS['env'] = $WP_ENV;
 $GLOBALS['css'] = $assets_css;
 $GLOBALS['js'] = $assets_js;
 $GLOBALS['img'] = $preRootImg;
 $GLOBALS['video'] = $preRootVideo;
 $GLOBALS['forms'] = [];
 $GLOBALS['tabs'] = 1;

 ?>
