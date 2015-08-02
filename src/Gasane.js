/**
 * @license inazumatv.com
 * @author (at)taikiken / http://inazumatv.com
 * @date 2015/03/24 - 12:10
 *
 * Copyright (c) 2011-@@year inazumatv.com, inc.
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 * @build @@buildTime
 * @version @@version
 * @git @@repository
 *
 */
/**
 * Fps, Polling 時間管理eventを発行します
 * @module Gasane
 */
var Gasane = Gasane || {};

( function ( window ){
  "use strict";

  var
    self = window.self;

  /**
   * Polyfill methods として以下の関数を用意しています。
   *
   *    Date.now
   *
   *    requestAnimationFrame
   *    cancelAnimationFrame
   *
   */


  // Date.now
  // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Date/now
  if ( !Date.now ) {

    Date.now = function now() {

      return new Date().getTime();

    };
  }

  // requestAnimationFrame
  // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
  ( function (){
    var
      lastTime = 0,
      vendors = [ 'ms', 'moz', 'webkit', 'o' ],
      x,
      limit,
      currTime,
      timeToCall,
      id,
      _max;

    for ( x = 0, limit = vendors.length; x < limit && !self.requestAnimationFrame; ++ x ) {

      self.requestAnimationFrame = self[ vendors[ x ] + 'RequestAnimationFrame' ];
      self.cancelAnimationFrame = self[ vendors[ x ] + 'CancelAnimationFrame' ] || self[ vendors[ x ] + 'CancelRequestAnimationFrame' ];
    }

    if ( self.requestAnimationFrame === undefined && self.setTimeout !== undefined ) {

      _max = Math.max;

      self.requestAnimationFrame = function ( callback ) {

        currTime = Date.now();
        timeToCall = _max( 0, 16 - ( currTime - lastTime ) );
        id = self.setTimeout( function() { callback( currTime + timeToCall ); }, timeToCall );

        lastTime = currTime + timeToCall;

        return id;
      };

    }

    if( self.cancelAnimationFrame === undefined && self.clearTimeout !== undefined ) {

      self.cancelAnimationFrame = function ( id ) { self.clearTimeout( id ); };

    }

  }() );
}( window ) );