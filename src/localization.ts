import { ConfigLanguage } from "@dchighs/dc-core"
import axios from "axios"

export type LocalizatioLanguage = ConfigLanguage | `${ConfigLanguage}`

export type LocalizationOptions = {
    language: LocalizatioLanguage
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

export type QueryfyStringOptions = {
    text: string
    lowerCase?: boolean
    normalizeLetters?: boolean
    trimSpaces?: boolean
}

export type SearchKeysOptions = {
    query: string
} & Omit<QueryfyStringOptions, "text">

export type SearchValuesOptions = {
    query: string
} & Omit<QueryfyStringOptions, "text">

export class Localization {
    readonly language: LocalizatioLanguage
    readonly url: string
    readonly data: Record<string, string>

    constructor({ language, data }: LocalizationOptions) {
        this.language = language
        this.url = Localization.buildUrl(language)
        this.data = data
    }

    static buildUrl(language: LocalizatioLanguage): string {
        return `https://sp-translations.socialpointgames.com/deploy/dc/android/prod/dc_android_${language}_prod_wetd46pWuR8J5CmS.json`
    }

    static async fetch(language: LocalizatioLanguage): Promise<LocalizationArrayData> {
        const response = await axios.get(Localization.buildUrl(language))
        const data = response.data
        return data
    }

    static async create(language: LocalizatioLanguage) {
        const arrayData = await Localization.fetch(language)
        const data = Object.assign({}, ...arrayData)

        return new Localization({
            language: language,
            data: data
        })
    }

    getValueFromKey(key: string): string | undefined {
        return this.data[key]
    }

    getKeyFromValue(value: string): string | undefined {
        return Object.entries(this.data)
            .find(([, v]) => v === value)?.[0]
    }

    getDragonName(id: number) {
        const key = `tid_unit_${id}_name`
        return this.getValueFromKey(key)
    }

    getDragonDescription(id: number) {
        const key = `tid_unit_${id}_description`
        return this.getValueFromKey(key)
    }

    getAttackName(id: number) {
        const key = `tid_attack_name_${id}`
        return this.getValueFromKey(key)
    }

    getSkillName(id: number) {
        const key = `tid_skill_name_${id}`
        return this.getValueFromKey(key)
    }

    getSkillDescription(id: number) {
        const key = `tid_skill_description_${id}`
        return this.getValueFromKey(key)
    }

    private normalizeText({
        text,
        lowerCase = true,
        normalizeLetters = true,
        trimSpaces = true
    }: QueryfyStringOptions): string {
        let result = text

        if (lowerCase) result = result.toLowerCase()
        if (normalizeLetters) {
            result = result.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        }
        if (trimSpaces) result = result.trim()

        return result
    }

    searchKeys({
        query,
        lowerCase = true,
        normalizeLetters = true,
        trimSpaces = true
    }: SearchKeysOptions): string[] {
        query = this.normalizeText({
            text: query,
            lowerCase: lowerCase,
            normalizeLetters: normalizeLetters,
            trimSpaces: trimSpaces
        })

        const keys = Object.keys(this.data)

        const results = keys.filter(key => {
            const parsedKey = this.normalizeText({
                text: key,
                lowerCase: lowerCase,
                normalizeLetters: normalizeLetters,
                trimSpaces: trimSpaces
            })

            return parsedKey.includes(query)
        })

        return results
    }

    searchValues({
        query,
        lowerCase = true,
        normalizeLetters = true,
        trimSpaces = true
    }: SearchValuesOptions): string[] {
        query = this.normalizeText({
            text: query,
            lowerCase: lowerCase,
            normalizeLetters: normalizeLetters,
            trimSpaces: trimSpaces
        })

        const values = Object.values(this.data)

        const results = values.filter(value => {
            const parsedValue = this.normalizeText({
                text: value,
                lowerCase: lowerCase,
                normalizeLetters: normalizeLetters,
                trimSpaces: trimSpaces
            })

            return parsedValue.includes(query)
        })

        return results
    }

    toObject(): LocalizationData {
        return this.data
    }

    toArray(): LocalizationArrayData {
        return Object.entries(this.data).map(([key, value]) => ({
            [key]: value,
        }))
    }

    static compare(a: Localization, b: Localization): ComparisonResult {
        const newFields: ComparisonResultNewField[] = []
        const editedFields: ComparisonResultEditedField[] = []
        const deletedFields: ComparisonResultDeletedField[] = []
        const oldObject = a.toObject()
        const newObject = b.toObject()

        if (a.language !== b.language) {
            throw new Error("Languages do not match")
        }

        for (const key in newObject) {
            if (!(key in oldObject)) {
                newFields.push({
                    key: key,
                    value: newObject[key]
                })
            } else if (newObject[key] !== oldObject[key]) {
                editedFields.push({
                    key: key,
                    values: {
                        old: oldObject[key],
                        new: newObject[key]
                    }
                })
            }
        }

        for (const key in oldObject) {
            if (!(key in newObject)) {
                deletedFields.push({
                    key: key,
                    value: oldObject[key]
                })
            }
        }

        return {
            newFields: newFields,
            editedFields: editedFields,
            deletedFields: deletedFields
        }
    }

    compare(other: Localization): ComparisonResult {
        return Localization.compare(this, other)
    }

    translate<T extends Record<string, any>>(object: T): T {
        const translatedObject: Record<string, any> = {...object}

        for (const key in translatedObject) {
            if (["tid_name", "chest_name_key", "name_key", "island_title_tid"].includes(key)) {
                const name = this.getValueFromKey(object[key])

                if (name) {
                    translatedObject.name = name
                    delete translatedObject[key]
                }
            } else if (key === "type_name_key") {
                const typeName = this.getValueFromKey(object[key])

                if (typeName) {
                    translatedObject.type = typeName
                    delete translatedObject[key]
                }
            }

            if (key === "description_key") {
                const description = this.getValueFromKey(object[key])

                if (description) {
                    translatedObject.description = description
                    delete translatedObject[key]
                }
            }

            if (key === "group_type" && translatedObject.group_type === "DRAGON") {
                const dragonId = translatedObject.id as number
                translatedObject.name = this.getDragonName(dragonId)
                translatedObject.description = this.getDragonDescription(dragonId)
            }
        }

        return translatedObject as T
    }
}