// * custom scripts
import * as browserWebp from "./modules/functions.js"
import * as navbar from "../htmlParts/components/Navbar/navbar.js"

// подключение бургера
navbar.burgerMenu()
window.addEventListener('scroll', navbar.fixedNav)

// webp
browserWebp.isWebp()
