import "react";
import "purecss";
import "./main.css";
import component from "./component";
import { bake } from "./shake";

bake();

document.body.appendChild(component());
