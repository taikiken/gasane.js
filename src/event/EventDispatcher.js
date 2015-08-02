/**
 * @description
 * ## カスタム Event を管理します
 *
 * 1. 必要なClassでmixinします
 * 2. mixin 後下記の6関数が使用できるようになります
 *
 *
 *      addEventListener
 *      hasEventListener
 *      removeEventListener
 *      dispatchEvent
 *      on
 *      off
 *
 *      function SomeClass () {}
 *      // mixin
 *      Gasane.EventDispatcher.initialize( SomeClass.prototype );
 *
 *
 * @module Gasane
 * @submodule EventDispatcher
 *
 */
( function ( window ){
  "use strict";
  var
    Gasane = window.Gasane;

  Gasane.EventDispatcher = ( function (){
    /**
     * ### カスタム Event を管理します
     * - 必要なClassでmixinします
     * - mixin 後下記の6関数が使用できるようになります
     *
     *
     *      addEventListener
     *      hasEventListener
     *      removeEventListener
     *      dispatchEvent
     *      on
     *      off
     *
     * @class EventDispatcher
     * @constructor
     */
    function EventDispatcher () {
      //this._listeners = {};
    }

    var p = EventDispatcher.prototype;

    p.constructor = EventDispatcher;

    /**
     * イベントにハンドラを登録します
     *
     * ハンドラ内のthisはイベント発生元になるので注意が必要です
     *
     * this参照を変えないために bind を使用する方法があります
     *
     *      function EventReceive () {
     *          var example = new ExampleClass();
     *
     *          example.addEventListener( "other", onOtherHandler );
     *          example.addEventListener( "example", this.onBoundHandler.bind( this ) );
     *      }
     *
     *      EventReceive.prototype.onOtherHandler ( event ) {
     *          console.log( this );// ExampleClass
     *      }
     *
     *      EventReceive.prototype.onBoundHandler ( event ) {
     *          console.log( this );// EventReceive
     *      }
     *
     * @method addEventListener
     * @param {string} type event type
     * @param {function} listener event handler
     */
    p.addEventListener = function ( type, listener ) {

      this.on( type, listener );

    };
    /**
     * addEventListener alias
     * @method on
     * @param {string} type event type
     * @param {function} listener event handler
     */
    p.on = function ( type, listener ) {

      if ( typeof listener === 'undefined' ) {
        // listener undefined
        return;

      }

      if ( typeof this._listeners === 'undefined') {

        this._listeners = {};

      }

      var listeners = this._listeners;

      if ( typeof listeners[ type ] === 'undefined' ) {

        listeners[ type ] = [];

      }

      if ( listeners[ type ].indexOf( listener ) === - 1 ) {

        listeners[ type ].push( listener );

      }

    };

    /**
     * @method hasEventListener
     * @param {string} type event type
     * @param {function} listener event handler
     * @return {boolean} event type へ listener 登録が有るか無いかの真偽値を返します
     */
    p.hasEventListener = function ( type, listener ) {

      var listeners = this._listeners;

      if ( typeof listeners === 'undefined') {

        return false;

      } else if ( typeof listener[ type ] !== 'undefined' && listeners[ type ].indexOf( listener ) !== - 1 ) {

        return true;

      }

      return false;

    };

    /**
     * event type から listener を削除します
     *
     * メモリーリークの原因になるので不要になったlistenerは必ずremoveEventListenerを実行します
     *
     * @method removeEventListener
     * @param {string} type event type
     * @param {function} listener event handler
     */
    p.removeEventListener = function ( type, listener ) {

      this.off( type, listener );

    };
    /**
     * removeEventListener alias
     * @method off
     * @param {string} type event type
     * @param {function} listener event handler
     */
    p.off = function ( type, listener ) {

      var
        listeners = this._listeners,
        listeners_types,
        index;

      if ( typeof listeners === 'undefined') {

        return;
      }

      listeners_types = listeners[ type ];

      if ( typeof listeners_types !== 'undefined' ) {

        index = listeners_types.indexOf( listener );

        if ( index !== -1 ) {

          listeners_types.splice( index, 1 );

        }
      }

    };

    /**
     * event発生をlistenerに通知します
     *
     * @method dispatchEvent
     * @param {Object} event require event.type:String, { type: 'some_event', [] }
     */
    p.dispatchEvent = function ( event ) {

      var
        listeners = this._listeners,
        listeners_types,
        listener,
        i, limit;

      if ( typeof listeners === 'undefined' || typeof event.type === 'undefined' ) {

        return;

      }

      listeners_types = listeners[ event.type ];

      if ( typeof listeners_types !== 'undefined' ) {

        event.target = this;

        for ( i = 0, limit = listeners_types.length; i < limit; i = ( i + 1 )|0 ) {

          listener = listeners_types[ i ];

          if ( !!listener ) {

            listener.call( this, event );

          }

        }
      }

    };

    /**
     * ## EventDispatcher mixin
     *
     * 6関数を引数(object)へ追加します
     *
     * - addEventListener
     * - hasEventListener
     * - removeEventListener
     * - dispatchEvent
     * - on
     * - off
     *
     *
     *      function SomeClass () {}
     *      // mixin
     *      Gasane.EventDispatcher.initialize( SomeClass.prototype );
     *
     *      var someObject = {};
     *      // mixin
     *      Gasane.EventDispatcher.initialize( someObject );
     *
     * @method initialize
     * @param {Object} object
     * @static
     */
    EventDispatcher.initialize = function ( object ) {

      object.addEventListener = p.addEventListener;
      object.on = p.on;
      object.hasEventListener = p.hasEventListener;
      object.removeEventListener = p.removeEventListener;
      object.off = p.off;
      object.dispatchEvent = p.dispatchEvent;

    };

    return EventDispatcher;
  }() );
}( window ) );