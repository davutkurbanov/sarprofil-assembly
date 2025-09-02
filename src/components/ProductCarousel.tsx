"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, ShoppingCart, Heart } from "lucide-react"
import productData from "@/src/data/product.json"

interface ProductCarouselProps {
  title: string
  products: typeof productData.upsell
}

export function ProductCarousel({ title, products }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [favorites, setFavorites] = useState<string[]>([])

  const nextProduct = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length)
  }

  const prevProduct = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length)
  }

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  if (products.length === 0) return null

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">{title}</h3>

      <div className="relative">
        <div className="flex gap-4 overflow-hidden">
          {products.map((product, index) => {
            const isActive = index === currentIndex
            const isVisible = Math.abs(index - currentIndex) <= 1

            return (
              <Card
                key={product.id}
                className={`flex-shrink-0 transition-all duration-300 ${
                  isActive ? "w-80 opacity-100 scale-100" : "w-64 opacity-60 scale-95"
                } ${isVisible ? "block" : "hidden"}`}
              >
                <CardHeader className="pb-3">
                  <div className="relative">
                    <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-3">
                      <img
                        src={product.image || "/placeholder.png?height=200&width=300&query=furniture"}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain rounded-lg"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 p-2"
                      onClick={() => toggleFavorite(product.id)}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          favorites.includes(product.id) ? "fill-red-500 text-red-500" : "text-gray-400"
                        }`}
                      />
                    </Button>
                  </div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">New Arrival</Badge>
                    <span className="text-lg font-semibold">$299</span>
                  </div>

                  <p className="text-sm text-gray-600">
                    Perfect complement to your {productData.name}. High-quality construction with modern design.
                  </p>

                  <div className="flex gap-2">
                    <Button className="flex-1" size="sm">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Navigation Arrows */}
        {products.length > 1 && (
          <>
            <Button
              variant="outline"
              size="sm"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full w-10 h-10 p-0 bg-white/80 backdrop-blur-sm"
              onClick={prevProduct}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full w-10 h-10 p-0 bg-white/80 backdrop-blur-sm"
              onClick={nextProduct}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Dots Indicator */}
        {products.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {products.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-blue-600" : "bg-gray-300"
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
