import { CheckBoxFieldFormElement } from "./fields/CheckBoxField";
import { DateFieldFormElement } from "./fields/DateField";
import { NumberFieldFormElement } from "./fields/NumberField";
import { ParagraphFieldFormElement } from "./fields/Paragraph";
import { SelectFieldFormElement } from "./fields/SelectField";
import { SeparatorFieldFormElement } from "./fields/SeparatorField";
import { SpacerFieldFormElement } from "./fields/SpacerField";
import { SubtitleFieldFormElement } from "./fields/SubtitleField";
import { TextAreaFieldFormElement } from "./fields/TextAreaField";
import { TextFieldFormElement } from "./fields/TextField";
import { TitleFieldFormElement } from "./fields/TitleField";

export type ElementsType = "TextField" 
| "TitleField" 
| "SubtitleField" 
| "Paragraph"
| "SeparatorField"
| "SpacerField"
| "NumberField"
| "TextAreaField"
| "DateField"
| "SelectField"
| "CheckBoxField"


export type SubmitValueFunctionType = (key:string,value:string) => void;

export type FormElement = {
  type: ElementsType;
  construct: (id: string) => FormElementInstance
  designerBtnElement:{
    icon: React.ElementType,
    label: string
  } 
  designerComponent: React.FC<{elementInstance : FormElementInstance}>; // component user sees in designer window
  formComponent: React.FC<{
    elementInstance : FormElementInstance,
    submitValue?: SubmitValueFunctionType, 
    isInvalid?: boolean,
    defaultValue?:string
  } >; // component user sees in preview window   

  propertiesComponent: React.FC<{elementInstance : FormElementInstance}>
  validate: (formElement: FormElementInstance,currentValue:string) => boolean
}

export type FormElementInstance = {
  id: string,
  type: ElementsType,
  extraAttributes?: Record<string, any>
}

type FormElementsType = {
  [key in ElementsType]: FormElement
}
 
export const FormElements: FormElementsType = {
  "TextField": TextFieldFormElement,
  "TitleField": TitleFieldFormElement,
  "SubtitleField": SubtitleFieldFormElement,
  "Paragraph": ParagraphFieldFormElement,
  "SeparatorField": SeparatorFieldFormElement,
  "SpacerField": SpacerFieldFormElement,
  "NumberField": NumberFieldFormElement,
  "TextAreaField": TextAreaFieldFormElement,
  "DateField": DateFieldFormElement,
  "SelectField":  SelectFieldFormElement,
  "CheckBoxField": CheckBoxFieldFormElement
}