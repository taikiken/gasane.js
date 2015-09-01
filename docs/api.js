YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "Cycle",
        "EventDispatcher",
        "Fps",
        "Polling"
    ],
    "modules": [
        "Cycle",
        "EventDispatcher",
        "Fps",
        "Gasane",
        "Polling"
    ],
    "allModules": [
        {
            "displayName": "Cycle",
            "name": "Cycle",
            "description": "requestAnimationFrame Event を発火します"
        },
        {
            "displayName": "EventDispatcher",
            "name": "EventDispatcher",
            "description": "## カスタム Event を管理します\n\n1. 必要なClassでmixinします\n2. mixin 後下記の6関数が使用できるようになります\n\n\n     addEventListener\n     hasEventListener\n     removeEventListener\n     dispatchEvent\n     on\n     off\n\n     function SomeClass () {}\n     // mixin\n     Gasane.EventDispatcher.initialize( SomeClass.prototype );"
        },
        {
            "displayName": "Fps",
            "name": "Fps",
            "description": "指定 fps(frame rate per second)毎にeventを通知します"
        },
        {
            "displayName": "Gasane",
            "name": "Gasane",
            "description": "Fps, Polling 時間管理eventを発行します"
        },
        {
            "displayName": "Polling",
            "name": "Polling",
            "description": "polling指定時間（ミリセカンド）毎に通知を行います"
        }
    ],
    "elements": []
} };
});