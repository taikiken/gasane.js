/**
 * 指定 fps(frame rate per second)毎にeventを通知します
 *
 * @module Gasane
 */
( function( window ){
  'use strict';

  var
    Gasane = window.Gasane;

  Gasane.Fps = ( function(){
    var
      EventDispatcher = Gasane.EventDispatcher,
      Cycle = Gasane.Cycle,
      _now = Date.now;

    /**
     *
     * 24fps毎に実行する
     *
     *      var fps = new Gasane.Fps( 24 );
     *      fps.on( Gasane.Fps.ENTER_FRAME, function() {
     *        //
     *      } );
     *
     *      fps.start();
     *
     * @class Fps
     * @uses EventDispatcher
     * @param {int} fps frame rate
     * @constructor
     */
    function Fps ( fps ) {
      /**
       * @property _fps
       * @type {Number}
       * @private
       */
      this._fps = fps;
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
       * frame 間時間, frame rate 計算に使用。 1000 / fps
       * @property _polling
       * @type {number}
       * @private
       */
      this._polling = 0;
      /**
       * Cycle.UPDATE event handler binding
       * @property _boundUpdate
       * @type {function(this:Fps)|*}
       * @private
       */
      this._boundUpdate = this.update.bind( this );
      /**
       * @property _event
       * @type {{type: string, scope: Fps}}
       * @private
       */
      this._event = { type: Fps.ENTER_FRAME, scope: this };
    }

    /**
     * @event ENTER_FRAME
     * @static
     * @type {string}
     */
    Fps.ENTER_FRAME = 'enterFrame';

    var p = Fps.prototype;

    // mixin
    EventDispatcher.initialize( p );
    p.constructor = Fps;

    /**
     * Fps 計算を開始します
     * @method start
     * @return {Fps}
     */
    p.start = function() {

      if ( !this._started ) {

        // not started
        this._started = true;
        this.setFps( this._fps );

        // Cycle listener
        Cycle.on( Cycle.UPDATE, this._boundUpdate );
        Cycle.start();

      }

      return this;

    };
    /**
     * Fps 計算を止めます
     * @method stop
     * @return {Fps}
     */
    p.stop = function() {

      if ( this._started ) {

        // started
        this._started = false;
        Cycle.off( Cycle.UPDATE, this._boundUpdate );

      }

      this._polling = Number.MAX_VALUE;

      return this;

    };
    /**
     * @method fps
     * @return {int} 現在 fps を返します
     */
    p.fps = function() {

      return this._fps;

    };
    /**
     * @method setFps
     * @param {int} fps fps を設定します
     * @return {Fps}
     */
    p.setFps = function( fps ) {

      this._start = this.now();
      this._polling = 1000 / fps;
      this._fps = fps;

      return this;

    };
    /**
     * Fps.setFps alias
     * @method changeFps
     * @param {int} fps fps を変更します
     * @return {Fps}
     */
    p.changeFps = function( fps ) {

      this.setFps( fps );

      return this;

    };
    /**
     * @method now
     * @return {number} 現在時間(timestamp)を返します
     */
    p.now = function() {

      return _now();

    };
    /**
     * Cycle.update event handler
     * @method update
     */
    p.update = function() {

      var
        now = this.now(),
        event;

      if ( ( now - this._start ) >= this._polling ) {

        this._start = now;

        event = this._event;
        event.current = now;
        this.dispatchEvent( event );

      }

    };

    return Fps;

  }() );

}( window ) );
