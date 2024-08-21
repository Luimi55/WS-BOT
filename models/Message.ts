import { Option } from "./Option"

export interface Message {
    id : string,
    text : string,
    options: Option[]
}