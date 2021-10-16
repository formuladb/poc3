interface Borders {
    border?: 0 | 1 | 2 | 3 | 4;
    borderTop?: 0 | 1 | 2 | 3 | 4;
    borderRight?: 0 | 1 | 2 | 3 | 4;
    borderBottom?: 0 | 1 | 2 | 3 | 4;
    borderLeft?: 0 | 1 | 2 | 3 | 4;
    borderColor?:
    | "primary.main"
    | "secondary.main"
    | "error.main"
    | "warning.main"
    | "info.main"
    | "success.main"
    | "text.primary"
    | "text.secondary"
    | "text.disabled"
    ;
    borderRadius?: 0 | 5 | 10 | 20 | 30 | 40 | 50;
}

interface Spacing {
    margin?: 0 | 0.5 | 1 | 2 | 3 | 4 | 5;
    marginTop?: 0 | 0.5 | 1 | 2 | 3 | 4 | 5;
    marginRight?: 0 | 0.5 | 1 | 2 | 3 | 4 | 5;
    marginBottom?: 0 | 0.5 | 1 | 2 | 3 | 4 | 5;
    marginLeft?: 0 | 0.5 | 1 | 2 | 3 | 4 | 5;
    marginX?: 0 | 0.5 | 1 | 2 | 3 | 4 | 5;
    marginY?: 0 | 0.5 | 1 | 2 | 3 | 4 | 5;
    padding?: 0 | 0.5 | 1 | 2 | 3 | 4 | 5;
    paddingTop?: 0 | 0.5 | 1 | 2 | 3 | 4 | 5;
    paddingRight?: 0 | 0.5 | 1 | 2 | 3 | 4 | 5;
    paddingBottom?: 0 | 0.5 | 1 | 2 | 3 | 4 | 5;
    paddingLeft?: 0 | 0.5 | 1 | 2 | 3 | 4 | 5;
    paddingX?: 0 | 0.5 | 1 | 2 | 3 | 4 | 5;
    paddingY?: 0 | 0.5 | 1 | 2 | 3 | 4 | 5;
}

export interface BoxProps {
    borders?: Borders;
    spacing?: Spacing;
}

export interface TypographyProps {
    // | 'fontFamily'
    // | 'fontSize'
    variant?: 
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "subtitle1"
    | "subtitle2"
    | "body1"
    | "body2"
    | "button"
    | "caption"
    | "overline"
    ;
    fontStyle?:
    | "normal"
    | "italic"
    | "oblique"
    ;
    fontWeight?:
    | ""
    | "Light"
    | "Regular"
    | "Medium"
    | "500"
    | "Bold"
    ;
    letterSpacing?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    lineHeight?: "normal" | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    textAlign ?: 
    | "left"
    | "center"
    | "right"
    ;
}
