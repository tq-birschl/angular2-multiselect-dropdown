export interface DropdownSettings {
    singleSelection: boolean;
    text: string;
    enableCheckAll: boolean;
    selectAllText: string;
    unSelectAllText: string;
    filterSelectAllText: string;
    filterUnSelectAllText: string;
    enableFilterSelectAll: boolean;
    enableSearchFilter: boolean;
    searchBy: string[];
    maxHeight: number;
    badgeShowLimit: number;
    classes: string;
    limitSelection?: number;
    disabled?: boolean;
    searchPlaceholderText: string;
    groupBy?: string;
    showCheckbox?: boolean;
    noDataLabel: string;
    searchAutofocus?: boolean;
    lazyLoading?: boolean;
    labelKey?: string;
    primaryKey: string;
    position: string;
    loading?: boolean;
    selectGroup?: boolean;
    addNewItemOnFilter?: boolean;
    addNewButtonText?: string;
    escapeToClose?: boolean;
    autoPosition?: boolean;
    clearAll?: boolean;
    fixedPlaceholder?: string;
}
