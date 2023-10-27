// @ts-nocheck
import Konva from "konva";
import { Util } from "konva/lib/Util";
import { KonvaNodeComponent } from "react-konva/ReactKonvaCore";

const strokeWidth = 2;
class RTransformer extends Konva.Transformer {
  update() {
    var attrs = this._getNodeRect();

    this.rotation(Util._getRotation(attrs.rotation));
    var width = attrs.width;
    var height = attrs.height;

    var enabledAnchors = this.enabledAnchors();
    var resizeEnabled = this.resizeEnabled();
    var padding = this.padding();

    var anchorSize = this.anchorSize();
    this.find("._anchor").forEach((node) => {
      node.setAttrs({
        width: anchorSize,
        height: anchorSize,
        offsetX: anchorSize / 2,
        offsetY: anchorSize / 2,
        stroke: this.anchorStroke(),
        strokeWidth: this.anchorStrokeWidth(),
        fill: this.anchorFill(),
        cornerRadius: this.anchorCornerRadius()
      });
    });

    this._batchChangeChild(".top-left", {
      x: 0,
      y: 0,
      offsetX: anchorSize / 2 + padding,
      offsetY: anchorSize / 2 + padding,
      visible: resizeEnabled && enabledAnchors.indexOf("top-left") >= 0
    });
    this._batchChangeChild(".top-center", {
      width: width,
      x: 0,
      y: 0,
      offsetY: anchorSize / 2 + padding,
      visible: resizeEnabled && enabledAnchors.indexOf("top-center") >= 0
    });
    this._batchChangeChild(".top-right", {
      x: width,
      y: 0,
      offsetX: anchorSize / 2 - padding,
      offsetY: anchorSize / 2 + padding,
      visible: resizeEnabled && enabledAnchors.indexOf("top-right") >= 0
    });
    this._batchChangeChild(".middle-left", {
      x: 0,
      y: 0,
      height: height,
      offsetX: anchorSize / 2 + padding,
      visible: resizeEnabled && enabledAnchors.indexOf("middle-left") >= 0
    });
    this._batchChangeChild(".middle-right", {
      x: width,
      y: 0,
      height: height,
      offsetX: anchorSize / 2 - padding,
      visible: resizeEnabled && enabledAnchors.indexOf("middle-right") >= 0
    });
    this._batchChangeChild(".bottom-left", {
      x: 0,
      y: height,
      offsetX: anchorSize / 2 + padding,
      offsetY: anchorSize / 2 - padding,
      visible: resizeEnabled && enabledAnchors.indexOf("bottom-left") >= 0
    });
    this._batchChangeChild(".bottom-center", {
      x: 0,
      y: height,
      width: width,
      offsetY: anchorSize / 2 - padding,
      visible: resizeEnabled && enabledAnchors.indexOf("bottom-center") >= 0
    });
    this._batchChangeChild(".bottom-right", {
      x: width,
      y: height,
      offsetX: anchorSize / 2 - padding,
      offsetY: anchorSize / 2 - padding,
      visible: resizeEnabled && enabledAnchors.indexOf("bottom-right") >= 0
    });

    this._batchChangeChild(".rotater", {
      x: width / 2,
      y: -this.rotateAnchorOffset() * Util._sign(height) - padding,
      visible: this.rotateEnabled()
    });

    this._batchChangeChild(".back", {
      width: width,
      height: height,
      visible: this.borderEnabled(),
      stroke: this.borderStroke(),
      strokeWidth: this.borderStrokeWidth(),
      dash: this.borderDash(),
      x: 0,
      y: 0
    });
    this.getLayer()?.batchDraw();
  }
}
Konva["RTransformer"] = RTransformer;

export default "RTransformer" as KonvaNodeComponent<
  Konva.Transformer,
  Konva.TransformerConfig
>;
