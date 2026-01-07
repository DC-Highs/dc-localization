import axios from "axios"

import { ComparisonResult, ComparisonResultDeletedField, ComparisonResultEditedField, ComparisonResultNewField, LocalizationArrayData, LocalizationData, LocalizationLanguage, LocalizationOptions, NormalizeTextOptions, SearchKeysOptions, SearchValuesOptions, Translated } from "./types"
import { descriptionKeysToTranslate, nameKeysToTranslate, typeNameKeysToTranslate } from "./utils"

export class Localization {
    readonly language: LocalizationLanguage
    readonly url: string
    readonly data: Record<string, string>

    constructor({ language, data }: LocalizationOptions) {
        this.language = language
        this.url = Localization.buildUrl(language)
        this.data = data
    }

    static buildUrl(language: LocalizationLanguage): string {
        return `https://sp-translations.socialpointgames.com/deploy/dc/android/prod/dc_android_${language}_prod_wetd46pWuR8J5CmS.json`
    }

    static async fetch(language: LocalizationLanguage): Promise<LocalizationArrayData> {
        const response = await axios.get(Localization.buildUrl(language))
        const data = response.data
        return data
    }

    static async create(language: LocalizationLanguage) {
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
    }: NormalizeTextOptions): string {
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

    translate<T extends Record<string, any>>(object: T): Translated<T> {
        const translatedObject: Record<string, any> = {...object}

        for (const key in translatedObject) {
            if (nameKeysToTranslate.includes(key as any)) {
                const name = this.getValueFromKey(object[key])

                if (name) {
                    translatedObject.name = name
                    delete translatedObject[key]
                }
            } else if (typeNameKeysToTranslate.includes(key as any)) {
                const typeName = this.getValueFromKey(object[key])

                if (typeName) {
                    translatedObject.type = typeName
                    delete translatedObject[key]
                }
            }

            if (descriptionKeysToTranslate.includes(key as any)) {
                const description = this.getValueFromKey(object[key])

                if (description) {
                    translatedObject.description = description
                    delete translatedObject[key]
                }
            }
        }

        return translatedObject as Translated<T>
    }
}