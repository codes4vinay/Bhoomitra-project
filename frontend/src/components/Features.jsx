import React from 'react'
import { Plane as Plant, ShoppingBag, Users2, BookOpen } from 'lucide-react';

const Features = () => {
    const features = [
        {
            icon: Plant,
            title: 'Sustainable Farming',
            description: 'Learn modern farming techniques that are environmentally friendly and profitable.',
        },
        {
            icon: ShoppingBag,
            title: 'Direct Sales',
            description: 'Connect directly with customers and sell your produce at better prices.',
        },
        {
            icon: Users2,
            title: 'Vendor Network',
            description: 'Access our network of trusted vendors for all your farming needs.',
        },
        {
            icon: BookOpen,
            title: 'Expert Guidance',
            description: 'Get advice from agricultural experts and improve your yield.',
        },
    ];

    return (
        <div className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature) => (
                        <div key={feature.title} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <feature.icon className="w-12 h-12 text-green-600 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Features;
