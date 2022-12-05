/* eslint-disable @typescript-eslint/no-explicit-any */
class PersistentFramework {
	static add(name: string, value: { [k: string]: any } | any[] | string) {
		localStorage.setItem(name, JSON.stringify(value));
	}

	static remove(name: string) {
		localStorage.removeItem(name);
	}

	static get(name: string): { [k: string]: any } | any[] | undefined {
		const value = localStorage.getItem(name);

		return value ? JSON.parse(value) : undefined;
	}
}

export default PersistentFramework;
