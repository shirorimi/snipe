//=============================================================================
// AltMenuScreen3.js
//=============================================================================

/*:
 * @plugindesc Yet Another menu screen layout.
 * @author Sasuke KANNAZUKI, Yoji Ojima
 */

/*:ja
 * @plugindesc レイアウトの異なるメニュー画面
 * @author 神無月サスケ, Yoji Ojima
 */

(function() {
    //
    // load bitmap that set in plugin parameter
    //
    var _Scene_Menu_createBackground = Scene_Menu.prototype.createBackground;
    Scene_Menu.prototype.createBackground = function(){
        if(bgBitmapMenu){
			this._backgroundSprite_01 = new Sprite();
            this._backgroundSprite_01.bitmap = SceneManager.backgroundBitmap();
            this.addChild(this._backgroundSprite_01);
            this._backgroundSprite_02 = new Sprite();
            this._backgroundSprite_02.bitmap = ImageManager.loadPicture(bgBitmapMenu);
            this.addChild(this._backgroundSprite_02);
            return;
        }
        // if background file is invalid, it does original process.
        _Scene_Menu_createBackground.call(this);
    };
})();
