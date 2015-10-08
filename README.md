# gasane.js
Event 管理, requestAnimationFrame wrapper

Custom Event の作成などに使えます

## API
[Docs](http://localhost:63342/gasane.js/docs/)

### Polling

    var polling = new Gasane.Polling( 1000 );
    polling.on( Gasane.Polling.PAST, function () {
    }
    
    polling.start();
    
### Fps

    var fps = new Gasane.Fps( 24 );
    fps.on( Gasane.Fps.ENTER_FRAME, function () {
    }
    
    fps.start();
