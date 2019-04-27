<?php
require_once('config.php');

function divichild_enqueue_scripts() {
  wp_enqueue_style( 'parent-style', get_template_directory_uri() . '/style.css' );

  $css = $GLOBALS['css'];
  $js = $GLOBALS['js'];
  $WP_ENV = $GLOBALS['wp_env'];

  wp_enqueue_style('css', get_stylesheet_directory_uri() . $css, false, null);
  wp_enqueue_script('script', get_stylesheet_directory_uri() . $js, null, true);

  /**
   * Adds livereload and local styles for local enviroment
  **/
  if ($WP_ENV === 'development') {
    wp_register_script('livereload', 'http://localhost:35729/livereload.js?snipver=1', null, false, true);
    wp_enqueue_script('livereload');
  }
}
add_action( 'wp_enqueue_scripts', 'divichild_enqueue_scripts' );
