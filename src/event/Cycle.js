/**
 * requestAnimationFrame Event を発火します
 *
 * @module Gasane
 *
 *
 */
( function ( window ){

  'use strict';

  var
    Gasane = window.Gasane;

  Gasane.Cycle = ( function (){
    var
      EventDispatcher = Gasane.EventDispatcher,
      animation = window.self.requestAnimationFrame,
      cancel = window.self.cancelAnimationFrame;

    /**
     * requestAnimationFrame Event を発火します
     * @class Cycle
     * @static
     * @constructor
     */
    function Cycle () {
      throw new Error( 'Cycle can\'t create instance.' );
    }

    /**
     * @property started
     * @static
     * @type {boolean}
     */
    Cycle.started = false;

    /**
     * @property id
     * @static
     * @type {number}
     */
    Cycle.id = 0;

    /**
     * @event UPDATE
     * @static
     * @type {string}
     */
    Cycle.UPDATE = 'cycleUpdate';

    /**
     * @property event
     * @static
     * @type {{type: string, scope: Cycle}}
     */
    Cycle.event = { type: Cycle.UPDATE, scope: Cycle };

    EventDispatcher.initialize( Cycle );

    var p = Cycle.prototype;

    p.constructor = Cycle;

    /**
     * requestAnimationFrame を開始します
     * @method start
     * @static
     */
    Cycle.start = function () {

      if ( !Cycle.started ) {
        // start when not started
        Cycle.started = true;
        Cycle.update();

      }

    };

    /**
     * requestAnimationFrame を停止します
     *
     * 全てのlistener handlerに影響します
     *
     * 個別に止める場合は listener を off(removeEventListener) して下さい
     *
     * @method stop
     * @static
     */
    Cycle.stop = function () {

      if ( Cycle.started ) {
        // cancel when started
        cancel( Cycle.id );
        Cycle.started = false;
        Cycle.id = 0;

      }

    };

    /**
     * requestAnimationFrame event handler
     * @method update
     * @static
     */
    Cycle.update = function () {
      // requestAnimationFrame loop
      Cycle.id = animation( Cycle.update );
      // event fire
      Cycle.dispatchEvent( Cycle.event );
    };

    return Cycle;
  }() );

}( window ) );
