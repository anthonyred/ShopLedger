const test = require('node:test');
const assert = require('node:assert/strict');

const invoice = require('../lib/invoice');
const pricing = require('../lib/pricing');

function sampleOrder() {
  return {
    id: 9001,
    date: '22/11/2026',
    customer: 'In-memory customer',
    paymentMode: 'cash',
    status: 'completed',
    coupon: 'WELCOME',
    items: [
      { id: 1, sku: 'RICE-1', name: 'Rice', hsn: '1006', price: 100, qty: 1 },
      { id: 2, sku: 'GHEE-1', name: 'Ghee', hsn: '0405', price: 100, qty: 1 }
    ]
  };
}

test('invoice figures use checkout HSN slabs, coupon allocation, and GST split', function () {
  const order = sampleOrder();
  const checkout = pricing.computeTotals(order.items, order.coupon);
  const invoiceFigures = invoice.computeInvoiceFigures(order);

  assert.deepEqual({
    subtotal: invoiceFigures.subtotal,
    discount: invoiceFigures.discount,
    taxable: invoiceFigures.taxable,
    tax: invoiceFigures.tax,
    cgst: invoiceFigures.cgst,
    sgst: invoiceFigures.sgst,
    total: invoiceFigures.total
  }, {
    subtotal: 200,
    discount: checkout.discount,
    taxable: checkout.taxable,
    tax: checkout.tax,
    cgst: checkout.cgst,
    sgst: checkout.sgst,
    total: checkout.total
  });
  assert.deepEqual(invoiceFigures.rows.map(function (row) { return [row.gstPercent, row.lineDiscount, row.lineTax]; }), [
    [5, 5, 4.75],
    [12, 5, 11.4]
  ]);
});

test('printable invoice displays the checkout GST split and total', function () {
  const html = invoice.render(sampleOrder());
  assert.match(html, /<td>CGST<\/td><td class="r">₹8\.08<\/td>/);
  assert.match(html, /<td>SGST<\/td><td class="r">₹8\.07<\/td>/);
  assert.match(html, /Invoice Total<\/td><td class="r">₹206\.15<\/td>/);
});
