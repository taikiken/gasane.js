/*!
 * Copyright (c) 2011-2016 inazumatv.com, inc.
 * @author (at)taikiken / http://inazumatv.com
 * @date 2015/03/24 - 12:10
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 * @build 2016-12-29 22:07:42
 * @version 0.9.9
 * @git https://github.com/taikiken/gasane.js
 *
 */
/**
 * Fps, Polling 時間管理eventを発行します
 *
 * Polyfill methods として以下の関数を用意しています。
 *
 *    Date.now
 *    requestAnimationFrame
 *    cancelAnimationFrame
 *
 * @module Gasane
 * @type {{}}
 */
var Gasane = window.Gasane || {};

(function(window) {
  'use strict';
  var
    self = window.self;
  // Date.now
  // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Date/now
  if (!Date.now) {
    Date.now = function now() {
      return new Date().getTime();
    };
  }

  // requestAnimationFrame
  // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
  (function() {
    var
      lastTime = 0,
      vendors = [ 'ms', 'moz', 'webkit', 'o' ],
      x,
      limit,
      currTime,
      timeToCall,
      id,
      mathMax;

    for (x = 0, limit = vendors.length; x < limit && !self.requestAnimationFrame; ++x) {
      self.requestAnimationFrame = self[ vendors[ x ] + 'RequestAnimationFrame' ];
      self.cancelAnimationFrame = self[ vendors[ x ] + 'CancelAnimationFrame' ] || self[ vendors[ x ] + 'CancelRequestAnimationFrame' ];
    }

    if (typeof self.requestAnimationFrame === 'undefined' && typeof self.setTimeout !== 'undefined') {
      mathMax = Math.max;

      self.requestAnimationFrame = function(callback) {
        currTime = Date.now();
        timeToCall = mathMax(0, 16 - (currTime - lastTime));
        id = self.setTimeout(function() {
          callback( currTime + timeToCall );
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    }

    if(typeof self.cancelAnimationFrame === 'undefined' && typeof self.clearTimeout !== 'undefined') {
      self.cancelAnimationFrame = function(timerId) {
        self.clearTimeout(timerId);
      };
    }
  }());
}(window));

/* jslint -W016 */
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
(function(window) {
  'use strict';
  var
    Gasane = window.Gasane;

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
  function EventDispatcher() {
    /**
     * eventType を key にした listener(function) を配列にし管理します
     * @type {{}}
     */
    this.listeners = {};
  }

  var p = EventDispatcher.prototype;
  p.constructor = EventDispatcher;
  // ----------------------------------------
  // METHOD
  // ----------------------------------------
  /**
   * EventDispatcher.on alias, EventDispatcher.on 使用推奨
   *
   * @method addEventListener
   * @param {string} type event type
   * @param {function} listener event handler
   */
  p.addEventListener = function(type, listener) {
    this.on(type, listener);
  };
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
   * @method on
   * @param {string} type event type
   * @param {function} listener event handler
   */
  p.on = function(type, listener) {
    // if (typeof listener === 'undefined') {
    if (!listener) {
      // listener undefined
      return;
    }

    if (typeof this.listeners === 'undefined') {
      this.listeners = {};
    }

    var listeners = this.listeners;

    if (typeof listeners[type] === 'undefined') {
      listeners[type] = [];
    }

    if (listeners[type].indexOf(listener) === -1) {
      listeners[type].push(listener);
    }
  };

  /**
   * EventDispatcher.has alias, EventDispatcher.has 使用推奨
   *
   * @method hasEventListener
   * @param {string} type event type
   * @param {function} listener event handler
   * @return {boolean} event type へ listener 登録が有るか無いかの真偽値を返します
   */
  p.hasEventListener = function(type, listener) {
    return this.has(type, listener);
  };

  /**
   * listener 登録があるか調べます
   *
   * @method has
   * @param {string} type event type
   * @param {function} listener event handler
   * @return {boolean} event type へ listener 登録が有るか無いかの真偽値を返します
   */
  p.has = function(type, listener) {
    var listeners = this.listeners;

    if ( typeof listeners === 'undefined') {
      return false;
    } else if (typeof listener[type] !== 'undefined' && listeners[type].indexOf(listener) !== -1) {
      return true;
    }
    return false;
  };

  /**
   * event type から listener を削除します
   *
   * メモリーリークの原因になるので不要になったlistenerは必ずremoveEventListenerを実行します
   *
   * EventDispatcher.off alias, EventDispatcher.off 使用推奨
   *
   * @method removeEventListener
   * @param {string} type event type
   * @param {function} listener event handler
   */
  p.removeEventListener = function(type, listener) {
    this.off(type, listener);
  };
  /**
   * event type から listener を削除します
   *
   * メモリーリークの原因になるので不要になったlistenerは必ずremoveEventListenerを実行します
   *
   * @method off
   * @param {string} type event type
   * @param {function} listener event handler
   */
  p.off = function(type, listener) {
    var
      listeners = this.listeners,
      listenersTypes,
      index,
      i, limit, found;

    if (typeof listeners === 'undefined') {
      return;
    }

    if (!listeners.hasOwnProperty(type)) {
      return;
    }
    listenersTypes = listeners[type];

    // if (typeof listenersTypes !== 'undefined') {
    //   index = listenersTypes.indexOf( listener );
    //
    //   if (index !== -1) {
    //     // listenersTypes.splice(index, 1);
    //     // dispatch 中にすぐ off （切り詰める）されると index が変わり続く listener が call できなくなるのでやめる
    //     // 変わりにnull代入
    //     listenersTypes[index] = null;
    //
    //     // 全て null の時は [] （空配列）にする
    //     found = false;
    //     for (i = 0, limit = listenersTypes.length; i < limit; i = (i + 1) | 0) {
    //       if (listenersTypes[i] !== null) {
    //         // null 以外が見つかったので処理中止
    //         found = true;
    //         break;
    //       }
    //     }
    //
    //     if (!found) {
    //       // null 以外が無い
    //       this.listeners[type] = [];
    //     }
    //   }
    // }
    index = listenersTypes.indexOf( listener );

    if (index !== -1) {
      // listenersTypes.splice(index, 1);
      // dispatch 中にすぐ off （切り詰める）されると index が変わり続く listener が call できなくなるのでやめる
      // 変わりにnull代入
      listenersTypes[index] = null;

      // 全て null の時は [] （空配列）にする
      found = false;
      for (i = 0, limit = listenersTypes.length; i < limit; i = (i + 1) | 0) {
        if (listenersTypes[i] !== null) {
          // null 以外が見つかったので処理中止
          found = true;
          break;
        }
      }

      if (!found) {
        // null 以外が無い
        this.listeners[type] = [];
      }
    }
  };

  /**
   * event発生をlistenerに通知します
   *
   * @method dispatchEvent
   * @param {Object} event require event.type:String, { type: 'some_event', [] }
   */
  p.dispatchEvent = function(event) {
    var
      listeners = this.listeners,
      listenersTypes,
      listener,
      i, limit;

    if (typeof listeners === 'undefined' || typeof event.type === 'undefined') {
      return;
    }

    listenersTypes = listeners[event.type];
    // if (typeof listenersTypes !== 'undefined') {
    if (listeners.hasOwnProperty(event.type)) {
      event.target = this;

      for (i = 0, limit = listenersTypes.length; i < limit; i = ( i + 1 ) | 0) {
        listener = listenersTypes[i];
        if (!!listener) {
          listener.call(this, event);
        }
      }
    }
  };
  // ----------------------------------------
  // STATIC METHOD
  // ----------------------------------------
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
   *      function SomeClass () {}
   *      // mixin
   *      Gasane.EventDispatcher.initialize(SomeClass.prototype);
   *
   *      var someObject = {};
   *      // mixin
   *      Gasane.EventDispatcher.initialize(someObject);
   *
   * @method initialize
   * @param {Object} object mixin する class prototype
   * @static
   */
  EventDispatcher.initialize = function(object) {
    object.addEventListener = p.addEventListener;
    object.on = p.on;
    object.hasEventListener = p.hasEventListener;
    object.has = p.has;
    object.removeEventListener = p.removeEventListener;
    object.off = p.off;
    object.dispatchEvent = p.dispatchEvent;
  };
  Gasane.EventDispatcher = EventDispatcher;
}(window));

/**
 * requestAnimationFrame Event を発火します
 *
 * @module Gasane
 *
 *
 */
(function(window) {
  'use strict';
  var
    Gasane = window.Gasane,

    EventDispatcher = Gasane.EventDispatcher,
    animation = window.self.requestAnimationFrame,
    cancel = window.self.cancelAnimationFrame;

  /**
   * requestAnimationFrame Event を発火します
   * @class Cycle
   * @static
   * @constructor
   */
  function Cycle() {
    throw new Error('Cycle can\'t create instance.');
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

  // mixin
  EventDispatcher.initialize(Cycle);

  var p = Cycle.prototype;
  p.constructor = Cycle;

  /**
   * requestAnimationFrame を開始します
   * @method start
   * @static
   */
  Cycle.start = function() {
    if (!Cycle.started) {
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
  Cycle.stop = function() {
    if (Cycle.started) {
      // cancel when started
      cancel(Cycle.id);
      Cycle.started = false;
      Cycle.id = 0;
    }
  };

  /**
   * requestAnimationFrame event handler
   * @method update
   * @static
   */
  Cycle.update = function() {
    // requestAnimationFrame loop
    Cycle.id = animation(Cycle.update);
    // event fire
    Cycle.dispatchEvent(Cycle.event);
  };

  Gasane.Cycle = Cycle;
}(window));

/**
 * polling指定時間（ミリセカンド）毎に通知を行います
 *
 * @module Gasane
 */
(function(window) {
  'use strict';
  var
    Gasane = window.Gasane,
    
    EventDispatcher = Gasane.EventDispatcher,
    Cycle = Gasane.Cycle,
    dateNow = Date.now;
  /**
   * polling指定時間（ミリセカンド）毎に通知を行います
   *
   *      // 1sec(1000ms)毎に実行する
   *      var polling = new Gasane.Polling( 1000 );
   *      polling.on( Gasane.Polling.PAST, function() {
   *        //
   *      } );
   *
   *      polling.start();
   *
   * @class Polling
   * @uses EventDispatcher
   * @param {number} polling milliseconds
   * @constructor
   */
  function Polling(polling) {
    /**
     * interval milliseconds
     * @property polling
     * @type {number}
     */
    this.polling = polling;
    /**
     * @property started
     * @type {boolean}
     * @private
     */
    this.started = false;
    /**
     * frame 開始時間, frame rate 計算に使用
     * @property startId
     * @type {number}
     * @private
     */
    this.startId = 0;
    /**
     * Cycle.UPDATE event handler binding
     * @property boundUpdate
     * @type {function(this:Fps)|*}
     * @private
     */
    this.boundUpdate = this.update.bind( this );
    /**
     * @property event
     * @type {{type: string, scope: Polling}}
     * @private
     */
    this.event = { type: Polling.PAST, scope: this };
  }

  /**
   * @event PAST
   * @static
   * @type {string}
   */
  Polling.PAST = 'pollingPast';
  var p = Polling.prototype;

  // mixin
  EventDispatcher.initialize( p );
  p.constructor = Polling;

  /**
   * polling 計算を開始します
   * @method start
   * @return {boolean} started flag を返します
   */
  p.start = function() {
    if (!this.started) {
      // not started
      this.started = true;
      this.setPolling( this.polling );
      // Cycle listener
      Cycle.on(Cycle.UPDATE, this.boundUpdate);
      Cycle.start();
    }
    return this.started;
  };
  /**
   * polling 計算を止めます
   * @method stop
   * @return {boolean} started flag を返します
   */
  p.stop = function() {
    if (this.started) {
      // started
      this.started = false;
      Cycle.off(Cycle.UPDATE, this.boundUpdate);
    }
    return this.started;
  };
  // /**
  //  * @method polling
  //  * @return {Number}
  //  */
  // p.polling = function() {
  //   return this.polling;
  // };
  /**
   * polling 時間を変更します
   * @method setPolling
   * @param {number} polling 変更する polling 時間
   * @return {number} 設定した polling
   */
  p.setPolling = function(polling) {
    this.startId = this.now();
    this.polling = polling;
    return polling;
  };
  /**
   * Polling.setPolling alias
   * @method changePolling
   * @param {number} polling 変更する polling 時間
   * @return {number} 設定した polling
   */
  p.changePolling = function(polling) {
    return this.setPolling(polling);
  };
  /**
   * @method now
   * @return {number} 現在時間(timestamp)を返します
   */
  p.now = function() {
    return dateNow();
  };
  /**
   * Cycle.update event handler
   * @method update
   */
  p.update = function() {
    var
      now = this.now(),
      event;

    if ((now - this.startId) >= this.polling) {
      this.startId = now;
      event = this.event;
      event.current = now;
      this.dispatchEvent(event);
    }
  };
  Gasane.Polling = Polling;
}( window ) );

/**
 * 指定 fps(frame rate per second)毎にeventを通知します
 *
 * @module Gasane
 */
(function(window) {
  'use strict';
  var
    Gasane = window.Gasane,

    EventDispatcher = Gasane.EventDispatcher,
    Cycle = Gasane.Cycle,
    dateNow = Date.now;

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
  function Fps(fps) {
    /**
     * @property fps
     * @type {Number}
     * @private
     */
    this.fps = fps;
    /**
     * @property started
     * @type {boolean}
     * @private
     */
    this.started = false;
    /**
     * frame 開始時間, frame rate 計算に使用
     * @property startId
     * @type {number}
     * @private
     */
    this.startId = 0;
    /**
     * frame 間時間, frame rate 計算に使用。 1000 / fps
     * @property polling
     * @type {number}
     * @private
     */
    this.polling = 0;
    /**
     * Cycle.UPDATE event handler binding
     * @property boundUpdate
     * @type {function(this:Fps)|*}
     * @private
     */
    this.boundUpdate = this.update.bind( this );
    /**
     * @property event
     * @type {{type: string, scope: Fps}}
     * @private
     */
    this.event = { type: Fps.ENTER_FRAME, scope: this };
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
   * @return {boolean} start flag を返します
   */
  p.start = function() {
    if (!this.started) {
      // not started
      this.started = true;
      this.setFps(this.fps);
      // Cycle listener
      Cycle.on(Cycle.UPDATE, this.boundUpdate);
      Cycle.start();
    }
    return this.started;
  };
  /**
   * Fps 計算を止めます
   * @method stop
   * @return {boolean} start flag を返します
   */
  p.stop = function() {
    if (this.started) {
      // started
      this.started = false;
      Cycle.off(Cycle.UPDATE, this.boundUpdate);
    }
    this.polling = Number.MAX_VALUE;
    return this.started;
  };
  // /**
  //  * @method fps
  //  * @return {int} 現在 fps を返します
  //  */
  // p.fps = function() {
  //   return this.fps;
  // };
  /**
   * @method setFps
   * @param {int} fps fps を設定します
   * @return {int} 設定した fps を返します
   */
  p.setFps = function(fps) {
    this.startId = this.now();
    this.polling = 1000 / fps;
    this.fps = fps;
    return fps;
  };
  /**
   * Fps.setFps alias
   * @method changeFps
   * @param {int} fps fps を変更します
   * @return {int} 設定した fps を返します
   */
  p.changeFps = function(fps) {
    return this.setFps(fps);
  };
  /**
   * @method now
   * @return {number} 現在時間(timestamp)を返します
   */
  p.now = function() {
    return dateNow();
  };
  /**
   * Cycle.update event handler
   * @method update
   */
  p.update = function() {
    var
      now = this.now(),
      event;

    if ((now - this.startId) >= this.polling) {
      this.startId = now;
      event = this.event;
      event.current = now;
      this.dispatchEvent(event);
    }
  };
  Gasane.Fps = Fps;
}(window));
