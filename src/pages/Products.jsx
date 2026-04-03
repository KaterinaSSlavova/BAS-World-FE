import { useState } from "react"
import AppLayout from "../components/AppLayout"
import { Input } from "../components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, Plus, Filter } from "lucide-react"
import { mockProducts, StatusBadge, RuleTypeBadge } from "@/data/mockData"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"

const Products = () => {
    const [search, setSearch] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("all")

    const categories = [...new Set(mockProducts.map(p => p.category))]

    const filtered = mockProducts.filter(p => {
        const matchesSearch =
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.id.toLowerCase().includes(search.toLowerCase())
        const matchesCategory =
            categoryFilter === "all" || p.category === categoryFilter
        return matchesSearch && matchesCategory
    })

    return (
        <AppLayout>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-foreground tracking-tight">
                        Products
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage cross-sell products and services
                    </p>
                </div>
                <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Product
                </Button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 mb-6">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="pl-9 bg-card border-border"
                    />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-48 bg-card border-border">
                        <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(c => (
                            <SelectItem key={c} value={c}>
                                {c}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <div className="glass-card overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="border-border/50 hover:bg-transparent">
                            <TableHead className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                                ID
                            </TableHead>
                            <TableHead className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                                Product
                            </TableHead>
                            <TableHead className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                                Category
                            </TableHead>
                            <TableHead className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                                Price
                            </TableHead>
                            <TableHead className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                                Stock
                            </TableHead>
                            <TableHead className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                                Rule Type
                            </TableHead>
                            <TableHead className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                                Status
                            </TableHead>
                            <TableHead className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                                Depots
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.map((product, i) => (
                            <TableRow
                                key={product.id}
                                className="border-border/30 hover:bg-muted/30 cursor-pointer animate-fade-in"
                                style={{ animationDelay: `${i * 40}ms` }}
                            >
                                <TableCell className="font-mono text-xs text-muted-foreground">
                                    {product.id}
                                </TableCell>
                                <TableCell className="font-medium text-sm">
                                    {product.name}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {product.category}
                                </TableCell>
                                <TableCell className="text-sm font-mono">
                                    €{product.price.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-sm font-mono">
                                    {product.stock === 999 ? "∞" : product.stock}
                                </TableCell>
                                <TableCell>
                                    <RuleTypeBadge type={product.ruleType} />
                                </TableCell>
                                <TableCell>
                                    <StatusBadge status={product.status} />
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground">
                                    {product.depots.join(", ")}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
    )
}

export default Products
