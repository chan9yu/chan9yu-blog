import { devices, test } from "@playwright/test";

import { defineDialogA11yTests } from "./dialog-a11y";

test.use({ ...devices["Pixel 7"] });

defineDialogA11yTests({
	describeTitle: "모바일 서랍 대화상자 접근성",
	triggerName: "메뉴 열기",
	dialogName: "메뉴"
});
