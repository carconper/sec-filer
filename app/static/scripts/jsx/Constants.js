
EC2_MICRO_DEV = 'http://ec2-54-219-188-73.us-west-1.compute.amazonaws.com:5000/';
EC2_MICRO_PROD = 'http://ec2-54-219-188-73.us-west-1.compute.amazonaws.com/';
OTHER_INSTANCE = '';

module.exports = {
	DEBUG_SEARCH: true,
	DEBUG_FILING: true,
	EC2_INUSE: EC2_MICRO_PROD,
	RESOURCE_API_SEARCH: 'metadata',
	RESOURCE_API_FILINGS: 'filings',
};
