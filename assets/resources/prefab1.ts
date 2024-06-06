const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
  @property(cc.Label)
  label: cc.Label = null;

  @property
  text: string = "hello";

  start() {
    cc.loader.loadRes("assets_resources_prefab1", cc.SpriteFrame, (err: any, res: cc.SpriteFrame) => {
      if (err) {
        console.log(err);
      } else {
        this.node.getComponent(cc.Sprite).spriteFrame = res;
      }
    });
  }
}
