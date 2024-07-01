const FontSize = 13;
export function createButtons(root: cc.Node, list: Array<{ name: string; cb: (label?: cc.Label) => void }>) {
  let widget = root.getComponent(cc.Widget);
  if (!widget) {
    widget = root.addComponent(cc.Widget);
  }
  widget.isAlignTop = true;
  widget.isAlignRight = true;
  widget.top = FontSize;
  widget.right = 10;
  widget.alignMode = cc.Widget.AlignMode.ALWAYS;

  let layout = root.getComponent(cc.Layout);
  if (!layout) {
    layout = root.addComponent(cc.Layout);
  }
  layout.type = cc.Layout.Type.VERTICAL;
  layout.spacingY = 5;

  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const node = new cc.Node();
    node.anchorX = 1;
    node.anchorY = 0.5;
    node.x = 0;
    const label = node.addComponent(cc.Label);
    label.fontSize = FontSize;
    label.lineHeight = FontSize;
    label.string = item.name || "";
    node.on(cc.Node.EventType.TOUCH_START, () => {
      node.color = new cc.Color(Math.random() * 255, Math.random() * 255, Math.random() * 255);
    });
    node.on(cc.Node.EventType.TOUCH_END, () => {
      item.cb && item.cb(label);
    });
    node.parent = root;
  }
  root.width = 0;
}
