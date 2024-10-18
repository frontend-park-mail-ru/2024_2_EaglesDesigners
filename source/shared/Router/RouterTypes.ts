import { View } from "@/app/View";

interface configRoute{
    path?: RegExp;
    view?: View;
}

export interface Routes{
    paths?: (
        configRoute[]
    )
}
