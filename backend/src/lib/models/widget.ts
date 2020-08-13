export enum WidgetType {
  Text = "Text",
}

export interface Widget {
  id: string;
  name: string;
  widgetType: WidgetType;
  dashboardId: string;
  content: any;
}

export interface WidgetItem {
  pk: string;
  sk: string;
  type: string;
  name: string;
  widgetType: string;
  content: any;
}

export interface TextWidget extends Widget {
  content: {
    text: string,
  }
}