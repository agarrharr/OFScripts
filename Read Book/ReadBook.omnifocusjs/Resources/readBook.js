(() => {
  const tags = ["📘 Book"];

  const getDaysArray = function (s, e) {
    for (var a = [], d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
      a.push(new Date(d));
    }
    return a;
  };

  var action = new PlugIn.Action(async function (selection) {
    const inputForm = new Form();
    inputForm.addField(new Form.Field.String("title", "Title", null));
    inputForm.addField(new Form.Field.Date("start", "Start Date", null));
    inputForm.addField(new Form.Field.Date("end", "End Date", null));
    inputForm.addField(new Form.Field.String("pages", "Number of Pages", null));

    inputForm
      .show("Book information:", "Continue")
      .then((formObject) => {
        const book = formObject.values;

        const pages = Number(book.pages);

        const dayList = getDaysArray(book.start, book.end);

        const project = new Project(`Read ${book.title}`);
        project.sequential = true;

        const pagesPerDay = Math.ceil(pages / dayList.length);
        dayList.forEach((day, i) => {
          const start = i * pagesPerDay + 1;
          const possibleEnd = start + pagesPerDay - 1;
          const end = possibleEnd > pages ? pages : possibleEnd;
          const task = new Task(
            `Read pages ${start}-${end} of ${book.title}`,
            project
          );
          task.dueDate = day;
          tags.forEach((tag) => {
            task.addTag(flattenedTags.filter((t) => t.name === tag)[0]);
          });
        });

        URL.fromString(`omnifocus:///task/${project.id.primaryKey}`).open();
      });
  });

  return action;
})();
