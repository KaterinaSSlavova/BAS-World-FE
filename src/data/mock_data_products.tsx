import Badge  from "../components/Badge";

export interface Product {
    id: string;
    name: string;
    category: string;
    status: "active" | "inactive" | "low_stock";
    ruleType: "mandatory" | "opt-in" | "opt-out";
    depots: string[];
    price: number;
    stock: number;
}

export const mockProducts: Product[] = [
    { id: "PRD-001", name: "Continental Tyre Set (315/80R22.5)", category: "Tyres", status: "active", ruleType: "opt-in", depots: ["Veghel NL", "Vienna AT"], price: 1240, stock: 84 },
    { id: "PRD-002", name: "Full Maintenance Package - 12 months", category: "Maintenance", status: "active", ruleType: "mandatory", depots: ["Veghel NL", "Vienna AT", "Madrid ES"], price: 3500, stock: 999 },
    { id: "PRD-003", name: "Exterior Deep Clean", category: "Cleaning", status: "active", ruleType: "opt-out", depots: ["Veghel NL"], price: 180, stock: 999 },
    { id: "PRD-004", name: "Diesel Fill-up 500L", category: "Diesel", status: "active", ruleType: "opt-in", depots: ["Veghel NL", "Vienna AT"], price: 750, stock: 999 },
    { id: "PRD-005", name: "Windshield Replacement - Truck", category: "Windshield", status: "low_stock", ruleType: "opt-in", depots: ["Veghel NL"], price: 890, stock: 3 },
    { id: "PRD-006", name: "AC System Repair & Regas", category: "AC Repair", status: "active", ruleType: "opt-in", depots: ["Veghel NL", "Madrid ES"], price: 420, stock: 45 },
    { id: "PRD-007", name: "Spare Key Set - Truck", category: "Spare Keys", status: "inactive", ruleType: "opt-in", depots: ["Vienna AT"], price: 95, stock: 0 },
    { id: "PRD-008", name: "Battery Replacement - Heavy Duty", category: "Batteries", status: "active", ruleType: "opt-in", depots: ["Veghel NL", "Vienna AT", "Madrid ES"], price: 310, stock: 28 },
    { id: "PRD-009", name: "Michelin Tyre Set (385/65R22.5)", category: "Tyres", status: "active", ruleType: "opt-in", depots: ["Madrid ES"], price: 1580, stock: 42 },
    { id: "PRD-010", name: "Interior Sanitisation", category: "Cleaning", status: "active", ruleType: "opt-out", depots: ["Veghel NL", "Vienna AT"], price: 120, stock: 999 },
];

export const mockDepots = [
    { id: "DEP-001", name: "Veghel", country: "Netherlands", code: "NL", products: 8, vehicles: 342, status: "operational" as const },
    { id: "DEP-002", name: "Vienna", country: "Austria", code: "AT", products: 6, vehicles: 128, status: "operational" as const },
    { id: "DEP-003", name: "Madrid", country: "Spain", code: "ES", products: 4, vehicles: 89, status: "operational" as const },
    { id: "DEP-004", name: "Warsaw", country: "Poland", code: "PL", products: 0, vehicles: 45, status: "setup" as const },
];

export const mockRules = [
    { id: "RUL-001", name: "Mandatory maintenance for trucks > 100k km", type: "mandatory" as const, condition: "mileage > 100000 AND type = 'truck'", products: ["PRD-002"], active: true },
    { id: "RUL-002", name: "Opt-out cleaning for all depot sales", type: "opt-out" as const, condition: "sale_type = 'depot'", products: ["PRD-003", "PRD-010"], active: true },
    { id: "RUL-003", name: "Tyre check for vehicles > 2 years", type: "opt-in" as const, condition: "age > 2 years", products: ["PRD-001", "PRD-009"], active: true },
    { id: "RUL-004", name: "Battery replacement for cold climates", type: "opt-in" as const, condition: "depot_country IN ('AT', 'PL')", products: ["PRD-008"], active: false },
];

export const statusConfig = {
    active: { label: "Active", className: "bg-success/10 text-success border-success/20" },
    inactive: { label: "Inactive", className: "bg-muted text-muted-foreground border-muted" },
    low_stock: { label: "Low Stock", className: "bg-warning/10 text-warning border-warning/20" },
    operational: { label: "Operational", className: "bg-success/10 text-success border-success/20" },
    setup: { label: "Setting Up", className: "bg-primary/10 text-primary border-primary/20" },
};

export const ruleTypeConfig = {
    mandatory: { label: "Mandatory", className: "bg-destructive/10 text-destructive border-destructive/20" },
    "opt-in": { label: "Opt-in", className: "bg-primary/10 text-primary border-primary/20" },
    "opt-out": { label: "Opt-out", className: "bg-muted text-muted-foreground border-muted" },
};

export const StatusBadge = ({ status }: { status: keyof typeof statusConfig }) => {
    const config = statusConfig[status];
    return (
        <Badge
            {...({ variant: "outline", className: config.className } as any)}
        >
            {config.label}
        </Badge>
    )};

export const RuleTypeBadge = ({ type }: { type: keyof typeof ruleTypeConfig }) => {
    const config = ruleTypeConfig[type];
    return (
        <Badge
            {...({ variant: "outline", className: config.className } as any)}
        >
            {config.label}
        </Badge>
    )};
