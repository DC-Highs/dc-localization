# @dchighs/dc-localization

**@dchighs/dc-localization** is a package for accessing, manipulating, and comparing translation data from the game [Dragon City](https://dragoncitygame.com/) (this is not an official library by SocialPoint; it is fan-made).

## 📦 Installation

Installation is straightforward; just use your preferred package manager. Here is an example using NPM:

```cmd
npm i @dchighs/dc-localization @dchighs/dc-core

```

> You need to install `@dchighs/dc-core` as well because I have set it as a `peerDependency`. This means the package requires `@dchighs/dc-core` as a dependency, but it will use the version the user has installed in the project.

## 🚀 Usage

<a href="https://www.buymeacoffee.com/marcuth">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" width="200">
</a>

### Fetching localization for a specific language

To create a `Localization` instance, you need to provide data or use the static method `.create(language: LocalizationLanguage)` by providing a valid language code:

```ts
import { Localization } from "@dchighs/dc-localization"
import { ConfigLanguage } from "@dchighs/dc-core"

;(async () => {
	const localization = await Localization.create(ConfigLanguage.English)
})();

```

---

### Loading a saved localization from a file

Supposing you have saved a JSON file containing localization data and want to load it to perform operations using the class, you can do it as follows:

```ts
import { Localization, LocalizationData } from "@dchighs/dc-localization"
import { ConfigLanguage } from "@dchighs/dc-core"
import fs from "node:fs"

;(async () => {
	const filePath = "localization.json"
	const contentString = await fs.promises.readFile(filePath, { encoding: "utf-8" })
	const data = JSON.parse(contentString) as LocalizationData // If it is Record<string, string>
	// const data = Object.assign({}, ...JSON.parse(contentString)) // If it is Array<Record<string, string>>

	const localization = new Localization({
		language: ConfigLanguage.English,
		data: data
	})
})();

```

---

### Getting values by Key, ID, and keys by Value

**Getting value by key:**

```ts
const value = localization.getValueFromKey("tid_unit_1000_name") // Nature Dragon

```

**Getting key by value:**

```ts
const key = localization.getKeyFromValue("Nature Dragon") // tid_unit_1000_name

```

**Getting dragon name by ID:**

```ts
const name = localization.getDragonName(1000) // Nature Dragon

```

**Getting dragon description by ID:**

```ts
const description = localization.getDragonDescription(1000) // The Nature Dragon loves humans, animals...

```

**Getting attack name by ID:**

```ts
const name = localization.getAttackName(1) // Punch

```

**Getting skill name by ID:**

```ts
const name = localization.getSkillName(1) // Rock Throw

```

**Getting skill description by ID:**

```ts
const description = localization.getSkillDescription(1) // Hits 1 to 5 times

```

---

### Searching values and keys

**Searching keys:**

```ts
const resultKeys = localization.searchKeys({
	query: "INPUT_HERE",
	lowerCase: true, /* text normalization config */
	normalizeLetters: true, /* text normalization config */
	trimSpaces: true /* text normalization config */
})

```

**Searching values:**

```ts
const resultValues = localization.searchValues({
	query: "INPUT_HERE",
	lowerCase: true, /* text normalization config */
	normalizeLetters: true, /* text normalization config */
	trimSpaces: true /* text normalization config */
})

```

---

### Transforming

**To get an object, a `Record<string, string>`:**

```ts
const data = localization.toObject() // or localization.data

```

**To get an array, an `Array<Record<string, string>>`:**

```ts
const data = localization.toArray()

```

---

### Comparing localizations

If you want to find the difference between two localization files, just use the static `Localization.compare(a: Localization, b: Localization)` or the instance method `Localization.compare(other: Localization)`:

```ts
;(async () => {
	const filePath = "localization.json"
	const contentString = await fs.promises.readFile(filePath, { encoding: "utf-8" })
	const data = JSON.parse(contentString) as LocalizationData
	
	const oldLocalization = new Localization({
		language: ConfigLanguage.English,
		data: data
	})
	
	const newLocalization = await Localization.create("en")
	
	const comparisonResult = newLocalization.compare(oldLocalization) // { newFields: [...], editedFields: [...], deletedFields: [...] }
})();

```

---

### Translating configuration

If you are dealing with game configuration data, you can translate it more easily using the `.translate(object: any)` method from `Localization`:

```ts
const dragon = {...}

const translatedDragon = localization.translate(dragon)

```

---

## 🤝 Contributing

* Want to contribute? Follow these steps:
* Fork the repository.
* Create a new branch (`git checkout -b feature-new`).
* Commit your changes (`git commit -m 'Add new feature'`).
* Push to the branch (`git push origin feature-new`).
* Open a Pull Request.

---

## 📝 License

This project is licensed under the MIT License.