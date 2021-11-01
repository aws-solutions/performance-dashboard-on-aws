import {
  TextWidget,
  WidgetType,
} from "performance-dashboard-backend/src/lib/models/widget";
import { WidgetContentBuilder } from "./widget-builder";

export class TextContentBuilder extends WidgetContentBuilder {
  private text: string | undefined;

  constructor() {
    super(WidgetType.Text);
  }

  withText(text: string) {
    this.text = text;
    return this;
  }

  build() {
    console.log("building content: {}", this);
    if (!this.text) {
      throw new Error("text is required");
    }
    const content: TextWidget["content"] = {
      text: this.text,
    };
    console.log("content created");
    return content;
  }
}
