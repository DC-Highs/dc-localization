export const snakeCaseKeysToTranslate = {
    name: ["tid_name", "chest_name_key", "name_key", "island_title_tid"] as const,
    typeName: ["type_name_key"] as const,
    description: ["description_key", "tid_description"] as const
}

export const camelCaseKeysToTranslate = {
    name: ["tidName", "chestNameKey", "nameKey", "islandTitleTid"] as const,
    typeName: ["typeNameKey"] as const,
    description: ["descriptionKey", "tidDescription"] as const
}

export type NameKeys =
    | typeof snakeCaseKeysToTranslate.name[number]
    | typeof camelCaseKeysToTranslate.name[number]

export type TypeNameKeys =
    | typeof snakeCaseKeysToTranslate.typeName[number]
    | typeof camelCaseKeysToTranslate.typeName[number]

export type DescriptionKeys =
    | typeof snakeCaseKeysToTranslate.description[number]
    | typeof camelCaseKeysToTranslate.description[number]

export type TranslatableKeys =
    | NameKeys
    | TypeNameKeys
    | DescriptionKeys

export const nameKeysToTranslate = [
    ...snakeCaseKeysToTranslate.name,
    ...camelCaseKeysToTranslate.name
]

export const typeNameKeysToTranslate = [
    ...snakeCaseKeysToTranslate.typeName,
    ...camelCaseKeysToTranslate.typeName
]

export const descriptionKeysToTranslate = [
    ...snakeCaseKeysToTranslate.description,
    ...camelCaseKeysToTranslate.description
]