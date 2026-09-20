import { expect } from "chai";

import { Library } from "../src/services/Library";

interface TestItem {
  readonly id: string;
  name: string;
}

describe("Library<T>", () => {
  let library: Library<TestItem>;

  beforeEach(() => {
    library = new Library<TestItem>();
  });

  it("додає об'єкт до колекції", () => {
    const item: TestItem = {
      id: "1",
      name: "Перший об'єкт"
    };

    library.add(item);

    expect(library.size).to.equal(1);
    expect(library.findById("1")).to.equal(item);
  });

  it("не дозволяє додати об'єкт із повторним ID", () => {
    library.add({
      id: "1",
      name: "Перший об'єкт"
    });

    expect(() => {
      library.add({
        id: "1",
        name: "Інший об'єкт"
      });
    }).to.throw("Об'єкт з ID 1 вже існує");
  });

  it("видаляє об'єкт із колекції", () => {
    library.add({
      id: "1",
      name: "Об'єкт для видалення"
    });

    const wasRemoved = library.remove("1");

    expect(wasRemoved).to.equal(true);
    expect(library.size).to.equal(0);
    expect(library.findById("1")).to.equal(undefined);
  });

  it("повертає false, якщо об'єкта для видалення немає", () => {
    const wasRemoved = library.remove("missing-id");

    expect(wasRemoved).to.equal(false);
  });

  it("знаходить об'єкт за ID", () => {
    const firstItem: TestItem = {
      id: "1",
      name: "Перший"
    };

    const secondItem: TestItem = {
      id: "2",
      name: "Другий"
    };

    library.add(firstItem);
    library.add(secondItem);

    expect(library.findById("2")).to.equal(secondItem);
  });

  it("шукає об'єкти за переданою умовою", () => {
    library.add({
      id: "1",
      name: "TypeScript"
    });

    library.add({
      id: "2",
      name: "JavaScript"
    });

    library.add({
      id: "3",
      name: "TypeScript Advanced"
    });

    const results = library.search((item) => item.name.includes("TypeScript"));

    expect(results).to.have.length(2);
    expect(results.map((item) => item.id)).to.deep.equal(["1", "3"]);
  });
});
