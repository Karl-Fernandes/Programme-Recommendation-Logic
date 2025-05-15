// How our data generated will be structured after processing inputs
export interface EligibilityResult {
    primary_tab: string;
    secondary_tabs: string[];
    commentary: { [key: string]: string };
}