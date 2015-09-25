<?php

class ReactJSCommonExtension extends LeftAndMainExtension {

    public function init() {
        Requirements::javascript(REACTJS_COMMON_PATH . "/public/dist/bundle.js");
    }

}
