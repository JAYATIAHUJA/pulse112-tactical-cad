 /**
 * Test Hume AI Config and Fetch Conversation Transcript
 */

const CONFIG_ID = '83ac26e4-0bc6-4d1b-bf24-4bcb4a0106ff';
const API_KEY = 'YiSpOGzm9FxWzfTN0Tw5ZF4y278WGz54BBWLGFg1mGJrAOnr';
const SECRET_KEY = '13NLSEfW1vh7tGP4g0npRPLFTiwv9FnEgYtflTOfkCViwv15uqwWPpgatv7pNnhE';

async function testConfig() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🧪 Testing Hume AI Configuration');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    // Test 1: Verify Config Exists
    console.log('📋 Test 1: Checking if config exists...');
    const configResponse = await fetch(
      `https://api.hume.ai/v0/evi/configs/${CONFIG_ID}`,
      {
        headers: {
          'X-Hume-Api-Key': API_KEY,
        },
      }
    );

    if (configResponse.ok) {
      const configData = await configResponse.json();
      console.log('✅ Config exists and is accessible!');
      console.log('   Name:', configData.name || 'N/A');
      console.log('   Version:', configData.version || 'N/A');
      console.log('   Created:', configData.created_on || 'N/A');
      console.log('');
    } else {
      console.log('❌ Config not found:', configResponse.status);
      console.log('   Response:', await configResponse.text());
      return;
    }

    // Test 2: List Chat Groups (Conversations)
    console.log('💬 Test 2: Fetching your conversations...');
    const chatsResponse = await fetch(
      `https://api.hume.ai/v0/evi/chat_groups?config_id=${CONFIG_ID}&page_size=10`,
      {
        headers: {
          'X-Hume-Api-Key': API_KEY,
        },
      }
    );

    if (chatsResponse.ok) {
      const chatsData = await chatsResponse.json();
      console.log(`✅ Found ${chatsData.chat_groups_page?.length || 0} conversation(s)`);
      
      if (chatsData.chat_groups_page && chatsData.chat_groups_page.length > 0) {
        console.log('\n📝 Your Conversations:\n');
        
        chatsData.chat_groups_page.forEach((chat, index) => {
          console.log(`   ${index + 1}. Chat Group ID: ${chat.id}`);
          console.log(`      Status: ${chat.status || 'N/A'}`);
          console.log(`      Created: ${chat.created_on || 'N/A'}`);
          console.log(`      Last Updated: ${chat.last_updated_on || 'N/A'}`);
          console.log('');
        });

        // Test 3: Fetch Transcript from Most Recent Chat
        const mostRecentChat = chatsData.chat_groups_page[0];
        console.log('\n📊 Test 3: Fetching transcript from most recent conversation...');
        console.log(`   Chat Group ID: ${mostRecentChat.id}\n`);

        const eventsResponse = await fetch(
          `https://api.hume.ai/v0/evi/chat_groups/${mostRecentChat.id}/events`,
          {
            headers: {
              'X-Hume-Api-Key': API_KEY,
            },
          }
        );

        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json();
          console.log('✅ Transcript Retrieved!\n');
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log('📋 CONVERSATION TRANSCRIPT');
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

          const events = eventsData.events_page || [];
          let messageCount = 0;

          events.forEach((event, index) => {
            if (event.type === 'USER_MESSAGE' || event.type === 'AGENT_MESSAGE') {
              messageCount++;
              const role = event.type === 'USER_MESSAGE' ? 'USER' : 'ASSISTANT';
              const content = event.message_text || event.text || 'N/A';
              
              console.log(`Message #${messageCount}:`);
              console.log(`  Role: ${role}`);
              console.log(`  Content: ${content}`);
              console.log(`  Time: ${event.timestamp || 'N/A'}`);
              
              // Show emotions if available
              if (event.emotions && event.emotions.length > 0) {
                console.log('  😊 Top Emotions:');
                event.emotions.slice(0, 3).forEach(emotion => {
                  console.log(`     ${emotion.name}: ${(emotion.score * 100).toFixed(1)}%`);
                });
              }
              
              console.log('');
            }
          });

          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log(`\n✅ Total Messages: ${messageCount}`);
          console.log(`✅ Total Events: ${events.length}`);
          
          // Show raw data for debugging
          console.log('\n📦 Raw Event Data (for debugging):');
          console.log(JSON.stringify(eventsData, null, 2));
          
        } else {
          console.log('❌ Failed to fetch transcript:', eventsResponse.status);
          console.log('   Response:', await eventsResponse.text());
        }
      } else {
        console.log('ℹ️  No conversations found. You may need to have a conversation first in the playground.');
      }
    } else {
      console.log('❌ Failed to fetch conversations:', chatsResponse.status);
      console.log('   Response:', await chatsResponse.text());
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Configuration Test Complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error during testing:', error);
    console.error('   Message:', error.message);
  }
}

// Run the test
testConfig();

