import { ConfigLanguage } from "@dchighs/dc-core"
import { TranslatableKeys } from "./utils"

export type LocalizationLanguage = ConfigLanguage | `${ConfigLanguage}`

export type LocalizationOptions = {
    language: LocalizationLanguage
    data: Record<string, string>
}

export type LocalizationData = Record<string, string>
export type LocalizationArrayData = Array<LocalizationData>

export type ComparisonResultNewField = {
    key: string
    value: string
}

export type ComparisonResultEditedFieldValues = {
    old: string
    new: string
}

export type ComparisonResultEditedField = {
    key: string
    values: ComparisonResultEditedFieldValues
}

export type ComparisonResultDeletedField = {
    key: string
    value: string
}

export type ComparisonResult = {
    newFields: ComparisonResultNewField[]
    editedFields: ComparisonResultEditedField[]
    deletedFields: ComparisonResultDeletedField[]
}

export type NormalizeTextOptions = {
    text: string
    lowerCase?: boolean
    normalizeLetters?: boolean
    trimSpaces?: boolean
}

export type SearchKeysOptions = {
    query: string
} & Omit<NormalizeTextOptions, "text">

export type SearchValuesOptions = {
    query: string
} & Omit<NormalizeTextOptions, "text">


type FinalName<T> = T extends { name: infer N } ? { name: N } : { name?: string }

type FinalType<T> = T extends { type: infer Ty } ? { type: Ty } : { type?: string }

type FinalDescription<T> = T extends { description: infer D } ? { description: D } : { description?: string }

export type Translated<T> =
    Omit<T, TranslatableKeys | "name" | "type" | "description">
    & FinalName<T>
    & FinalType<T>
    & FinalDescription<T>
