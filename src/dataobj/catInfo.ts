type CatInfo = {
  cat_uid: string;
  cat_name: string;
  cat_variety: string;
  cat_color: string;
  cat_temp: string;
};

const catInfoTitle = new Map<string, string>();

catInfoTitle.set("cat_name", "猫猫昵称");
catInfoTitle.set("cat_variety", "猫猫种类");
catInfoTitle.set("cat_color", "猫猫毛色");
catInfoTitle.set("cat_temp", "猫猫性格");

export type { CatInfo };
export { catInfoTitle };
