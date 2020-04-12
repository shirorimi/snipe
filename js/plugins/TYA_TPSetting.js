/*:
 * @plugindesc ＴＰに関する仕様を変更します。
 詳しい機能は各パラメータや、ヘルプを参照してください。
 * @author 茶の助
 *
 * @help [damageChargeTp]
 ダメージを受けた際に増加するTP量を変更できます。
 計算式には、damageRate（最大HPに対するダメージの割合）や、
 this.tcr（被ダメージ者のTPチャージ率）などが使えます。
 　例: 50 * damageRate * this.tcr → 最大ＨＰ相当のダメージでTP50増加
 
 [conversionTP]
 戦闘終了時、TPが溜まっていた際に、それをMPに変換できるようにします。
 　例: this.mmp * this.tp / 100 → TP1につき、MP1%回復
 
 [TPDamageUp] [TPDamageＣｕｔ]
 TPによって与ダメージを増加、被ダメージを軽減できるようにします。
　例1： TPDamageUp  = value * (100 + this.subject()._tp) / 100
　　   → TP100で与ダメージ200%
　例2： TPDamageＣｕｔ = value * (100 - target._tp / 2) / 100
　　   → TP100で被ダメージ50%
 *
 * @param startTPfixed
 * @desc ＴＰの初期値：固定
 startTPRandomの値が加算されます
 * @default 10
 *
 * @param startTPRandom
 * @desc ＴＰの初期値：ランダム
 startTPfixedの値が加算されます
 * @default 20
 *
 * @param TPLost
 * @desc HP0になった際、TPを0にする
 (1:する 0:しない)
 * @default 1
 *
 * @param damageChargeTP
 * @desc ダメージによるTP増加量の計算式
 * @default 50 * damageRate * this.tcr
 *
 * @param conversionTP
 * @desc 戦闘終了時、ＴＰをＭＰに変換する計算式
 * @default this.mmp * this.tp / 100
 *
 * @param TPDamageUp
 * @desc TPによる与ダメージ増加量の計算式
 変化させたくない場合は、valueとだけ書き込んでください
 * @default value * (100 + this.subject()._tp) / 100
 *
 * @param TPDamageCut
 * @desc TPによる被ダメージ軽減量の計算式
 変化させたくない場合は、valueとだけ書き込んでください
 * @default value * (100 - target._tp / 2) / 100
 */
 
 (function() {

    var parameters = PluginManager.parameters('TYA_TPSetting');
    var startTPfixed = Number(parameters['startTPfixed']);
    var startTPRandom = Number(parameters['startTPRandom']);
    var TPLost = Number(parameters['TPLost']) != 0;
    var damageChargeTP = parameters['damageChargeTP'];
    var conversionTP = parameters['conversionTP'];
    var TPDamageUp = parameters['TPDamageUp'];
    var TPDamageCut = parameters['TPDamageCut'];
    
    Game_Battler.prototype.initTp = function() {
        this.setTp(startTPfixed);
        this.gainTp(Math.randomInt(startTPRandom));
    };
	
	Game_Battler.prototype.chargeTpByDamage = function(damageRate) {
		var value = Math.floor(eval(damageChargeTP));
		this.gainSilentTp(value);
	};

    Game_Battler.prototype.onBattleEnd = function() {
        this.clearResult();
        this.removeBattleStates();
        this.removeAllBuffs();
        this.clearActions();
        if(conversionTP != 0){
			if (this.tp >= 1) {
				this.gainMp(Math.floor(eval(conversionTP)));
			}
        }
        if (!this.isPreserveTp()) {
            this.clearTp();
        }
        this.appear();
    };
	
	Game_Action.prototype.executeHpDamage = function(target, value) {
		if (value > 0) {
			if (this.subject().isActor() && !target.isActor()) {
				value = eval(TPDamageUp);
			}
			if (!this.subject().isActor() && target.isActor()) {
				value = eval(TPDamageCut);
			}
		}
		value = Math.floor(value);
		if (this.isDrain()) {
			value = Math.min(target.hp, value);
		}
		this.makeSuccess(target);
		target.gainHp(-value);
		if (value > 0) {
			target.onDamage(value);
		}
		this.gainDrainedHp(value);
	};
	
	var TYA_Game_Action_apply = Game_Action.prototype.apply;
	Game_Action.prototype.apply = function(target) {
		TYA_Game_Action_apply.call(this,target);
		
		if (TPLost && target.isActor() && target.hp == 0) {
			target.gainTp(-100);
		}
	};
})();