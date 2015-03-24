/**
 * license inazumatv.com
 * author (at)taikiken / http://inazumatv.com
 * date 2015/03/23 - 20:04
 *
 * Copyright (c) 2011-2015 inazumatv.com, inc.
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 */
( function ( window ){
  "use strict";

  var
    Gasane = window.Gasane;

  Gasane.Polling = ( function (){
    var
      EventDispatcher = Gasane.EventDispatcher,
      Cycle = Gasane.Cycle,
      _now = Date.now;

    /**
     * polling指定時間（ミリセカンド）毎に通知を行います
     * @class Polling
     * @param {number} polling milliseconds
     * @constructor
     */
    function Polling ( polling ) {
      this._polling = polling;
      /**
       * @property _started
       * @type {boolean}
       * @private
       */
      this._started = false;
      /**
       * frame 開始時間, frame rate 計算に使用
       * @property _start
       * @type {number}
       * @private
       */
      this._start = 0;
      /**
       * Cycle.UPDATE event handler binding
       * @property _boundUpdate
       * @type {function(this:Fps)|*}
       * @private
       */
      this._boundUpdate = this.update.bind( this );
      /**
       * @property _event
       * @type {{type: string, scope: Polling}}
       * @private
       */
      this._event = { type: Polling.PAST, scope: this };
    }

    /**
     * @event PAST
     * @type {string}
     */
    Polling.PAST = "pollingPast";

    var p = Polling.prototype;

    // mixin
    EventDispatcher.initialize( p );

    p.constructor = Polling;
    /**
     * polling 計算を開始します
     * @method start
     * @return {Polling}
     */
    p.start = function () {

      if ( !this._started ) {
        // not started
        this._started = true;
        this.setPolling( this._polling );

        // Cycle listener
        Cycle.on( Cycle.UPDATE, this._boundUpdate );
        Cycle.start();

      }

      return this;
    };
    /**
     * polling 計算を止めます
     * @method stop
     * @return {Polling}
     */
    p.stop = function () {

      if ( this._started ) {
        // started
        this._started = false;
        Cycle.off( Cycle.UPDATE, this._boundUpdate );

      }

      return this;
    };
    /**
     * @method polling
     * @return {Number}
     */
    p.polling = function () {

      return this._polling;

    };
    /**
     * @method setPolling
     * @param {number} polling
     * @return {Polling}
     */
    p.setPolling = function ( polling ) {

      this._start = this.now();
      this._polling = polling;

      return this;
    };
    /**
     * Polling.setPolling alias
     * @method changePolling
     * @param {number} polling
     * @return {Polling}
     */
    p.changePolling = function ( polling ) {

      this.setPolling( polling );

      return this;
    };
    /**
     * @method now
     * @return {number} 現在時間(timestamp)を返します
     */
    p.now = function () {
      return _now();
    };
    /**
     * Cycle.update event handler
     * @method update
     */
    p.update = function () {
      var
        now = this.now();

      if ( ( now - this._start ) >= this._polling ) {

        this._start = now;
        this.dispatchEvent( this._event );

      }

    };

    return Polling;
  }() );

}( window ) );