import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Product from '../models/product.model';
import Platform from '../models/platform.model';
import PlatformListing from '../models/platformListing.model';
import { Restaurant } from '../models/restaurant.model';
import { IntegrationService } from '../services/integration.service';

const integrationService = new IntegrationService();

type IntegrationComparison = {
  platform: string;
  basePrice: number;
  deliveryFee: number;
  discount: number;
  finalPrice: number;
  etaMinutes: number;
  redirectUrl: string;
  source: 'integration-service';
  productName: string;
  productImage: string | null;
  restaurantName: string;
  restaurantCuisine: string;
};

const normalizeIntegrationResults = (
  productName: string,
  integrationResponse: any
) => {
  const comparisons: IntegrationComparison[] = (integrationResponse?.results || [])
    .map((result: any) => {
      const numericPrice =
        typeof result.price === 'string'
          ? Number.parseFloat(result.price.replace(/[^\d.]/g, ''))
          : Number(result.price);

      if (!Number.isFinite(numericPrice)) {
        return null;
      }

      return {
        platform: result.platform || 'Unknown Platform',
        basePrice: numericPrice,
        deliveryFee: 0,
        discount: 0,
        finalPrice: numericPrice,
        etaMinutes: Number(result.etaMinutes) || 0,
        redirectUrl: result.redirectUrl || '#',
        source: 'integration-service',
        productName,
        productImage: null,
        restaurantName: 'Unknown restaurant',
        restaurantCuisine: 'Unknown',
      };
    })
    .filter(
      (comparison: IntegrationComparison | null): comparison is IntegrationComparison =>
        comparison !== null
    );

  const cheapest =
    comparisons.length > 0
      ? comparisons.reduce((min, current) =>
          current.finalPrice < min.finalPrice ? current : min
        )
      : null;

  const fastestDelivery =
    comparisons.length > 0
      ? comparisons.reduce((fastest, current) =>
          current.etaMinutes < fastest.etaMinutes ? current : fastest
        )
      : null;

  return {
    product: integrationResponse?.product || productName,
    restaurant: {
      id: null,
      name: 'Unknown restaurant',
      cuisine: 'Unknown',
      address: 'Unknown',
    },
    comparisons,
    cheapest,
    fastestDelivery,
    source: 'integration-service' as const,
  };
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, category, restaurantId, imageUrl } = req.body;

    const product = await Product.create({
      name,
      category,
      restaurantId,
      imageUrl,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating product' });
  }
};

export const getProducts = async (_req: Request, res: Response) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json(product);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching product' });
  }
};

export const addPlatformListing = async (req: Request, res: Response) => {
  try {
    const {
      productId,
      platformId,
      price,
      deliveryFee,
      discountType,
      discountValue,
      etaMinutes,
      redirectUrl,
    } = req.body;

    const listing = await PlatformListing.create({
      productId,
      platformId,
      price,
      deliveryFee,
      discountType,
      discountValue,
      etaMinutes,
      redirectUrl,
    });

    return res.status(201).json(listing);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error adding listing' });
  }
};

export const compareSearch = async (req: Request, res: Response) => {
  try {
    const product = `${req.query.product || ''}`.trim();

    if (!product) {
      return res.status(400).json({ message: 'Product query required' });
    }

    const foundProduct = await Product.findOne({
      where: {
        name: {
          [Op.like]: `%${product}%`,
        },
      },
      include: [
        {
          model: Restaurant,
          attributes: ['id', 'name', 'cuisineType', 'location'],
        },
      ],
    });

    if (!foundProduct) {
      const integrationResponse = await integrationService.comparePrices(product);
      const normalizedResponse = normalizeIntegrationResults(product, integrationResponse);

      if (!normalizedResponse.comparisons.length) {
        return res.status(404).json({ message: 'Product not found' });
      }

      return res.json(normalizedResponse);
    }

    const listings = await PlatformListing.findAll({
      where: { productId: foundProduct.id },
      include: [{ model: Platform }],
    });

    if (!listings.length) {
      const integrationResponse = await integrationService.comparePrices(foundProduct.name);
      const normalizedResponse = normalizeIntegrationResults(foundProduct.name, integrationResponse);

      if (!normalizedResponse.comparisons.length) {
        return res.status(404).json({ message: 'No listings found' });
      }

      return res.json(normalizedResponse);
    }

    const comparisons = listings.map((listing: any) => {
      const basePrice = parseFloat(listing.price);
      const deliveryFee = parseFloat(listing.deliveryFee || 0);
      const discountValue = parseFloat(listing.discountValue || 0);

      let discount = 0;

      if (listing.discountType === 'percentage') {
        discount = (basePrice * discountValue) / 100;
      } else if (listing.discountType === 'flat') {
        discount = discountValue;
      }

      const finalPrice = basePrice + deliveryFee - discount;

      return {
        productName: foundProduct.name,
        productImage: foundProduct.imageUrl,
        restaurantName: (foundProduct as any).Restaurant?.name || 'Unknown',
        restaurantCuisine: (foundProduct as any).Restaurant?.cuisineType || 'Unknown',
        platform: listing.Platform.name,
        platformLogo: listing.Platform.logoUrl,
        basePrice,
        deliveryFee,
        discount,
        finalPrice,
        etaMinutes: listing.etaMinutes,
        redirectUrl: listing.redirectUrl,
        discountType: listing.discountType,
        rating: listing.rating || 0,
        source: 'database' as const,
      };
    });

    const cheapest = comparisons.reduce((min: any, curr: any) =>
      curr.finalPrice < min.finalPrice ? curr : min
    );

    const fastestDelivery = comparisons.reduce((fastest: any, curr: any) =>
      curr.etaMinutes < fastest.etaMinutes ? curr : fastest
    );

    return res.json({
      product: foundProduct.name,
      restaurant: {
        id: (foundProduct as any).restaurantId,
        name: (foundProduct as any).Restaurant?.name || 'Unknown',
        cuisine: (foundProduct as any).Restaurant?.cuisineType || 'Unknown',
        address: (foundProduct as any).Restaurant?.location || 'Unknown',
      },
      comparisons,
      cheapest,
      fastestDelivery,
      source: 'database',
    });
  } catch (error) {
    console.error('Comparison error:', error);
    console.error('Error details:', {
      message: (error as any)?.message,
      stack: (error as any)?.stack,
    });
    return res.status(500).json({
      message: 'Error comparing prices',
      error: (error as any)?.message,
    });
  }
};

export const compareByRestaurant = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;

    if (!restaurantId) {
      return res.status(400).json({ message: 'Restaurant ID required' });
    }

    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const products = await Product.findAll({
      where: { restaurantId },
    });

    if (!products.length) {
      return res.status(404).json({ message: 'No products found for this restaurant' });
    }

    const allComparisons = [];

    for (const prod of products) {
      const listings = await PlatformListing.findAll({
        where: { productId: prod.id },
        include: [{ model: Platform }],
      });

      if (listings.length > 0) {
        const comparisons = listings.map((listing: any) => {
          const basePrice = parseFloat(listing.price);
          const deliveryFee = parseFloat(listing.deliveryFee || 0);
          const discountValue = parseFloat(listing.discountValue || 0);

          let discount = 0;

          if (listing.discountType === 'percentage') {
            discount = (basePrice * discountValue) / 100;
          } else if (listing.discountType === 'flat') {
            discount = discountValue;
          }

          const finalPrice = basePrice + deliveryFee - discount;

          return {
            productId: prod.id,
            productName: prod.name,
            productImage: prod.imageUrl,
            platform: listing.Platform.name,
            platformLogo: listing.Platform.logoUrl,
            basePrice,
            deliveryFee,
            discount,
            finalPrice,
            etaMinutes: listing.etaMinutes,
            redirectUrl: listing.redirectUrl,
            rating: listing.rating || 0,
          };
        });

        allComparisons.push(...comparisons);
      }
    }

    const sortedByPrice = [...allComparisons].sort((a, b) => a.finalPrice - b.finalPrice);

    return res.json({
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        cuisine: (restaurant as any).cuisineType || 'Unknown',
        address: (restaurant as any).location || 'Unknown',
      },
      productCount: products.length,
      comparisonCount: allComparisons.length,
      comparisons: sortedByPrice,
    });
  } catch (error) {
    console.error('Restaurant comparison error:', error);
    return res.status(500).json({
      message: 'Error comparing restaurant prices',
      error: (error as any)?.message,
    });
  }
};
