import { createButtons } from "./util";

const { ccclass, property } = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {
  @property(cc.Node)
  bgNode: cc.Node = null;

  @property(cc.SpriteFrame)
  frame: cc.SpriteFrame = null;
  protected onLoad(): void {
    // @ts-ignore
    cc.gc.init({
      log: true,
      enable: true,
      memoryLimit: 100,
      cycleFrame: 0,
      assetEnable: true,
      assetLimitCount: 1,
      assetLifeFrame: 10,
      removeNodeEnable: false,
      removeNodeLimitCount: 1,
      removeNodeLifeFrame: 10,
    });
    const root = new cc.Node();
    root.name = "buttons";
    root.zIndex = 100;
    this.node.addChild(root);
    createButtons(root, [
      {
        name: "mask",
        cb: () => {
          cc.resources.load("mask", cc.Prefab, (error, prefab) => {
            if (error) {
              console.error(error);
              return;
            }
            const node = cc.instantiate(prefab);
            this.bgNode.addChild(node);
          });
        },
      },
      {
        name: "particle",
        cb: () => {
          cc.resources.load("New Particle", cc.Prefab, (error, prefab) => {
            if (error) {
              return;
            }
            const node = cc.instantiate(prefab);
            this.bgNode.addChild(node);
          });
        },
      },
      {
        name: "logAssets",
        cb: () => {
          console.log(cc.assetManager.assets);
        },
      },
      {
        name: "log frame dyref",
        cb: () => {
          let assets = this.frame.getTexture();
          if (assets) {
            console.log(assets.dynamicRefCount);
          } else {
            console.error("can't get asset");
          }
        },
      },
      {
        name: "hide sprite",
        cb: (label: cc.Label) => {
          if (this.bgNode) {
            this.bgNode.active = !this.bgNode.active;
            label.string = this.bgNode.active ? "hide sprite" : "show sprite";
          }
        },
      },
      {
        name: "set spriteFrame",
        cb: () => {
          const sprite = this.bgNode.getComponent(cc.Sprite);
          if (sprite) {
            sprite.spriteFrame = this.frame;
            // sprite.sizeMode = cc.Sprite.SizeMode.RAW;
            // this.bgNode.setContentSize(500, 500);
          }
        },
      },
      {
        name: "reset spriteFrame",
        cb: () => {
          if (this.bgNode) {
            const spr = this.bgNode.getComponent(cc.Sprite);
            if (spr) {
              spr.spriteFrame = null;
            }
          }
        },
      },
      {
        name: "remove from parent",
        cb: () => {
          if (this.bgNode) {
            this.bgNode.removeFromParent();
            this.bgNode = null;
          }
        },
      },
      {
        name: "replace by loadRes",
        cb: () => {
          cc.loader.loadRes("assets_resources.png", cc.SpriteFrame, (error: Error, spriteFrame: cc.SpriteFrame) => {
            if (error) {
            } else {
              console.log(spriteFrame.getTexture().refCount);
              this.bgNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
              console.log(spriteFrame.getTexture().refCount);
            }
          });
        },
      },
      {
        name: "get resources dyref",
        cb: () => {
          cc.loader.loadRes("assets_resources.png", cc.SpriteFrame, (error: Error, spriteFrame: cc.SpriteFrame) => {
            if (error) {
            } else {
              console.log(spriteFrame.dynamicRefCount);
            }
          });
        },
      },
      {
        name: "clean frame",
        cb: () => {
          let assets = this.frame.getTexture();
          if (assets) {
            cc.assetManager.releaseAsset(assets);
            console.log("clean success");
          } else {
            console.error("can't get asset");
          }
        },
      },
      {
        name: "goto scene 2",
        cb: () => {
          cc.director.loadScene("2");
        },
      },
      {
        name: "self destroy",
        cb: () => {
          this.bgNode.destroy();
        },
      },
      {
        name: "self.children destroy",
        cb: () => {
          this.bgNode.destroyAllChildren();
        },
      },
      {
        name: "test hide&show",
        cb: () => {
          cc.loader.loadRes("assets_resources.png", cc.SpriteFrame, (error: Error, spriteFrame: cc.SpriteFrame) => {
            if (error) {
            } else {
              this.bgNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
              console.log("update spriteFrame success");
              setTimeout(() => {
                console.log("hide node");
                this.bgNode.active = false;
                setTimeout(() => {
                  console.log("show node");
                  this.bgNode.active = true;
                }, 1000);
              }, 1000);
            }
          });
        },
      },
      {
        name: "test removeFromParent",
        cb: () => {
          this.bgNode.removeFromParent();
        },
      },
      {
        name: "test removeAllChildren",
        cb: () => {
          this.bgNode.removeAllChildren();
        },
      },
      {
        name: "test remove&destroy",
        cb: () => {
          this.bgNode.removeFromParent();
          // @ts-ignore
          cc.pool.removeNodes.log();
          this.bgNode.destroy();
          // @ts-ignore
          cc.pool.removeNodes.log();
        },
      },
      {
        name: "test prefab",
        cb: () => {
          cc.loader.loadRes("prefab1", cc.Prefab, (error: Error, prefab: cc.Prefab) => {
            if (error) {
            } else {
              this.bgNode.addChild(cc.instantiate(prefab));
            }
          });
        },
      },
      {
        name: "test dragonbones prefab",
        cb: () => {
          cc.loader.loadRes("db/Prefab_NewDragon", cc.Prefab, (error: Error, prefab: cc.Prefab) => {
            if (error) {
              return;
            } else {
              // prefab的动态计数应该+1
              const ins = cc.instantiate(prefab);
              this.bgNode.addChild(ins);
            }
          });
        },
      },
      {
        name: "test dragon load",
        cb: () => {
          const file = "db/NewDragon";

          const createDB = (dbAsset: dragonBones.DragonBonesAsset, atlasAsset: dragonBones.DragonBonesAtlasAsset) => {
            const db = new cc.Node("db");
            const comp = db.addComponent(dragonBones.ArmatureDisplay);
            comp.dragonAsset = dbAsset;
            comp.dragonAtlasAsset = atlasAsset;
            comp.enableBatch = true;
            comp.armatureName = "armatureName";
            comp.animationName = "stand";
            // @ts-ignore
            cc.gc.protectAsset(dbAsset, false);
            // @ts-ignore
            cc.gc.protectAsset(atlasAsset, false);
            comp.playAnimation(comp.animationName, 0);
            this.bgNode.addChild(db);
          };
          cc.loader.loadRes(`${file}_tex`, dragonBones.DragonBonesAtlasAsset, (error1: Error, atlasAsset: dragonBones.DragonBonesAtlasAsset) => {
            if (error1) {
              console.log(error1);
              return;
            } else {
              // @ts-ignore
              cc.gc.protectAsset(atlasAsset, true);
              cc.loader.loadRes(`${file}_ske`, dragonBones.DragonBonesAsset, (error2: Error, dbAsset: dragonBones.DragonBonesAsset) => {
                if (error2) {
                  console.log(error2);
                  return;
                }
                // @ts-ignore
                cc.gc.protectAsset(dbAsset, true);
                createDB(dbAsset, atlasAsset);
              });
            }
          });
        },
      },
      {
        name: "test spine",
        cb: () => {
          const createSpine = (spine: sp.SkeletonData) => {
            const node = new cc.Node("spine");
            const spineComp = node.addComponent(sp.Skeleton);
            spineComp.skeletonData = spine;
            spineComp.animation = "walk";
            spineComp.loop = true;
            node.scale = 0.2;
            this.bgNode.addChild(node);
          };
          cc.loader.loadRes(`spine/raptor-pro`, sp.SkeletonData, (error: Error, asset: sp.SkeletonData) => {
            if (error) {
              console.log(error);
              return;
            }
            createSpine(asset);
          });
        },
      },
      {
        name: "test spine prefab",
        cb: () => {
          cc.loader.loadRes("spine/Prefab_raptor-pro", cc.Prefab, (error: Error, prefab: cc.Prefab) => {
            if (error) {
              return;
            } else {
              // prefab的动态计数应该+1
              const ins = cc.instantiate(prefab);
              ins.scale = 0.2;
              this.bgNode.addChild(ins);
            }
          });
        },
      },
      {
        name: "test spriteAtlas valid",
        cb: () => {
          if (!this.testAtlas) {
            cc.log(`sprite atlas is null`);
            return;
          }

          if (!this.testAtlas.isValid) {
            cc.log(`invalid sprite atlas`);
          }
          const frame = this.testAtlas.getSpriteFrame("yu2");
          if (!this.bgNode.isValid) {
            cc.error(`invalid node`);
            return;
          }
          const spr = this.bgNode.getComponent(cc.Sprite);
          spr.spriteFrame = frame;
        },
      },
      {
        name: "test spriteAtlas-1",
        cb: () => {
          cc.loader.loadRes("yu", cc.SpriteAtlas, (error: Error, spriteAtlas: cc.SpriteAtlas) => {
            if (error) {
              console.log(error);
            } else {
              this.testAtlas = spriteAtlas;
              // 这种方式会导致计数多一个, 因为Sprite.__preload的原因
              const node = new cc.Node();
              node.setPosition(Math.random() * 100, Math.random() * 100);
              const sprite = node.addComponent(cc.Sprite);
              sprite.spriteFrame = spriteAtlas.getSpriteFrame("yu1");
              this.bgNode.addChild(node);
            }
          });
        },
      },
      {
        name: "test spriteAtlas-2",
        cb: () => {
          cc.loader.loadRes("yu", cc.SpriteAtlas, (error: Error, spriteAtlas: cc.SpriteAtlas) => {
            if (error) {
              console.log(error);
            } else {
              this.testAtlas = spriteAtlas;
              this.bgNode.getComponent(cc.Sprite).spriteFrame = spriteAtlas.getSpriteFrame("yu1");
            }
          });
        },
      },
      {
        name: "test audio",
        cb: () => {
          debugger;
          cc.loader.loadRes("mp3", cc.AudioClip, (error: Error, audioClip: cc.AudioClip) => {
            if (error) {
              console.log(error);
            } else {
              const audioSource = this.bgNode.addComponent(cc.AudioSource);
              audioSource.clip = audioClip;
              audioSource.play();
            }
          });
        },
      },
      {
        name: "atlas animation",
        cb: () => {
          cc.loader.loadRes("yu", cc.SpriteAtlas, (error: Error, spriteAtlas: cc.SpriteAtlas) => {
            if (error) {
              console.log(error);
            } else {
              const node = new cc.Node();
              const sprite = node.addComponent(cc.Sprite);
              sprite.trim = false;
              sprite.sizeMode = cc.Sprite.SizeMode.RAW;
              const clip = cc.AnimationClip.createWithSpriteFrames(spriteAtlas.getSpriteFrames(), spriteAtlas.getSpriteFrames().length);
              clip.name = "test";
              clip.wrapMode = cc.WrapMode.Default;
              clip.speed = 1;
              clip.sample = spriteAtlas.getSpriteFrames().length;
              const animation = node.addComponent(cc.Animation);
              animation.addClip(clip);
              animation.defaultClip = clip;
              animation.play(clip.name);
              animation.on("finished", () => {
                console.log("finished");
                node.destroy();
              });
              this.bgNode.addChild(node);
            }
          });
        },
      },
      {
        name: "animation clip",
        cb: () => {
          cc.loader.loadRes("prefab-link-ani-clip", cc.AnimationClip, (error: Error, clip: cc.AnimationClip) => {
            if (error) {
              console.log(error);
              return;
            }
            // @ts-ignore
            cc.gc.protectAsset(clip, true);
            cc.loader.loadRes("prefab-test-ani-clip", cc.Prefab, (error: Error, prefab: cc.Prefab) => {
              if (error) {
                console.log(error);
                return;
              }
              const node = cc.instantiate(prefab);
              const animation = node.getComponent(cc.Animation);
              animation.addClip(clip);
              animation.defaultClip = clip;
              animation.play(clip.name);
              this.bgNode.addChild(node);
              // @ts-ignore
              cc.gc.protectAsset(clip, false);
            });
          });
        },
      },
    ]);
  }
  private testAtlas: cc.SpriteAtlas;
}
