import React from 'react'
const Testimonials = () => {
    const testimonials = [
        {
            name: 'John Smith',
            role: 'Organic Farmer',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80',
            quote: 'This platform has transformed how I manage my farm and connect with customers.',
        },
        {
            name: 'Sarah Johnson',
            role: 'Agricultural Expert',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80',
            quote: 'I can now reach more farmers and share my knowledge more effectively.',
        },
    ];

    return (
        <div className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {testimonials.map((testimonial) => (
                        <div key={testimonial.name} className="bg-gray-50 p-6 rounded-lg">
                            <div className="flex items-center mb-4">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-12 h-12 rounded-full object-cover mr-4"
                                />
                                <div>
                                    <h3 className="font-semibold">{testimonial.name}</h3>
                                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                                </div>
                            </div>
                            <p className="text-gray-700 italic">{testimonial.quote}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Testimonials;
