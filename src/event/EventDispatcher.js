/*jslint -W016*/
/**
 *
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
 *
 */
( function ( window ){
  'use strict';
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
     * ### mixin
     *
     *      function SomeClass () {}
     *      // mixin
     *      Gasane.EventDispatcher.initialize( SomeClass.prototype );
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
     * @deprecated instead of has
     * @param {string} type event type
     * @param {function} listener event handler
     * @return {boolean} event type へ listener 登録が有るか無いかの真偽値を返します
     */
    p.hasEventListener = function ( type, listener ) {

      return this.has( type, listener );

    };

    /**
     * @method has
     * @param {string} type event type
     * @param {function} listener event handler
     * @return {boolean} event type へ listener 登録が有るか無いかの真偽値を返します
     */
    p.has = function ( type, listener ) {

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
     *
     * event type から listener を削除します
     *
     * メモリーリークの原因になるので不要になったlistenerは必ずremoveEventListenerを実行します
     *
     * @method off
     * @param {string} type event type
     * @param {function} listener event handler
     */
    p.off = function ( type, listener ) {

      var
        listeners = this._listeners,
        listenersTypes,
        index,
        i, limit, found;

      if ( typeof listeners === 'undefined') {

        return;
      }

      listenersTypes = listeners[ type ];

      if ( typeof listenersTypes !== 'undefined' ) {

        index = listenersTypes.indexOf( listener );

        if ( index !== -1 ) {

          //listenersTypes.splice( index, 1 );
          // 切り詰めると dispatch 中にすぐ off されると index が変わり続く listener が call できなくなるのでやめる
          listenersTypes[ index ] = null;

          // 全て null の時は [] にする
          found = false;
          for ( i = 0, limit = listenersTypes.length; i < limit; i = (i + 1)|0 ) {

            if ( listenersTypes[ i ] !== null ) {

              // null 以外が見つかったので処理中止
              found = true;
              break;

            }

          }

          if ( !found ) {

            // null 以外が無い
            this._listeners[ type ] = [];

          }

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
        listenersTypes,
        listener,
        i, limit;

      if ( typeof listeners === 'undefined' || typeof event.type === 'undefined' ) {

        return;

      }

      listenersTypes = listeners[ event.type ];

      if ( typeof listenersTypes !== 'undefined' ) {

        event.target = this;

        for ( i = 0, limit = listenersTypes.length; i < limit; i = ( i + 1 )|0 ) {

          listener = listenersTypes[ i ];

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
      object.has = p.has;
      object.removeEventListener = p.removeEventListener;
      object.off = p.off;
      object.dispatchEvent = p.dispatchEvent;

    };

    return EventDispatcher;
  }() );
}( window ) );
