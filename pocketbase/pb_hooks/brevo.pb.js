/// <reference path="../pb_data/types.d.ts" />

// Hook: After user record is updated
onRecordAfterUpdateSuccess((e) => {
    // Get the updated record
    const record = e.record;
    
    // Check if wants_marketing field exists and has changed
    if (record.get('wants_marketing') !== undefined) {
        const userData = {
            email: record.get('email'),
            name: record.get('name'),
            wants_marketing: record.get('wants_marketing')
        };
        
        // Create contact data
        const contactData = {
            email: userData.email,
            attributes: {
                FIRSTNAME: userData.name || '',
                WANTS_MARKETING: userData.wants_marketing,
                // {optional} Set any other attributes here
            },
            emailBlacklisted: !userData.wants_marketing,
            listIds: [], // {optional} Add IDs of lists to add contact to
            updateEnabled: true, // This ensures we update if the contact already exists
        };

        try {
            // Send request to Brevo API
            let response = $http.send({
                url: `https://api.brevo.com/v3/contacts`,
                method: 'POST',
                headers: {
                    'api-key': process.env.BREVO_API_KEY,
                    'content-type': 'application/json',
                    'accept': 'application/json'
                },
                body: JSON.stringify(contactData)
            });
        } catch (error) {
            console.error(`Failed to manage contact ${userData.email} in Brevo:`, error);
        }
    }

    e.next();
}, 'users')

// Hook: After user record is created
onRecordAfterCreateSuccess((e) => {
    // Get the new record
    const record = e.record;
    
    // Check if wants_marketing is enabled
    if (record.get('wants_marketing') !== undefined) {
        const userData = {
            email: record.get('email'),
            name: record.get('name'),
            wants_marketing: record.get('wants_marketing')
        };
        
        // Create contact data
        const contactData = {
            email: userData.email,
            attributes: {
                FIRSTNAME: userData.name || '',
                WANTS_MARKETING: userData.wants_marketing,
                // {optional} Set any other attributes here
            },
            emailBlacklisted: !userData.wants_marketing,
            listIds: [], // {optional} Add IDs of lists to add contact to
            updateEnabled: true, // This ensures we update if the contact already exists
        };

        try {
            // Send request to Brevo API
            $http.send({
                url: `https://api.brevo.com/v3/contacts`,
                method: 'POST',
                headers: {
                    'api-key': process.env.BREVO_API_KEY,
                    'content-type': 'application/json',
                    'accept': 'application/json'
                },
                body: JSON.stringify(contactData)
            });
        } catch (error) {
            console.error(`Failed to manage contact ${userData.email} in Brevo:`, error);
        }
    }

    e.next();
}, 'users') 